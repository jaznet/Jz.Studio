import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JzPopoverErrorData } from '../models/jz-popover-error-data';

@Injectable({
  providedIn: 'root'
})
export class JzPopoverErrorService {

  build(error: unknown): JzPopoverErrorData {
    if (error instanceof HttpErrorResponse) {
      return this.buildFromHttpError(error);
    }

    if (error instanceof Error) {
      return {
        title: 'Application Error',
        message: error.message,
        technicalDetails: error.stack
      };
    }

    return {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred.',
      technicalDetails: this.safeStringify(error)
    };
  }

  private buildFromHttpError(error: HttpErrorResponse): JzPopoverErrorData {
    const serverMessage = this.getServerMessage(error);
    const message = serverMessage ?? error.message ?? 'The request failed.';

    return {
      title: this.getHttpTitle(error),
      message: this.getFriendlyMessage(message),
      technicalDetails: this.buildHttpDetails(error),
      status: error.status,
      statusText: error.statusText,
      url: error.url ?? undefined
    };
  }

  private getHttpTitle(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Connection Error';
    }

    if (error.status >= 500) {
      return 'Server Error';
    }

    if (error.status >= 400) {
      return 'Request Error';
    }

    return 'Data Load Failed';
  }

  private getServerMessage(error: HttpErrorResponse): string | undefined {
    if (!error.error) {
      return undefined;
    }

    if (typeof error.error === 'string') {
      return error.error;
    }

    return error.error.message
      ?? error.error.title
      ?? error.error.detail
      ?? undefined;
  }

  private getFriendlyMessage(message: string): string {
    const text = message.toLowerCase();

    if (
      text.includes('monthly free amount allowance') ||
      text.includes('database has reached') ||
      text.includes('is paused')
    ) {
      return 'Azure SQL has paused the database because the monthly free allowance has been reached.';
    }

    if (text.includes('internal server error') || text.includes('500')) {
      return 'The server encountered an internal error.';
    }

    return message;
  }

  private buildHttpDetails(error: HttpErrorResponse): string {
    return [
      `Status: ${error.status}`,
      `Status Text: ${error.statusText}`,
      `URL: ${error.url ?? ''}`,
      `Message: ${error.message}`,
      `Server Error: ${this.safeStringify(error.error)}`
    ].join('\n');
  }

  private safeStringify(value: unknown): string {
    if (value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
}
