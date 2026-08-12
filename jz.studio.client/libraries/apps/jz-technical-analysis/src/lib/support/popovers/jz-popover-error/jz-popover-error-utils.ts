import { HttpErrorResponse } from '@angular/common/http';
import { JzPopoverErrorData } from '../jz-popover-error/jz-popover-error.component';

export function buildJzPopoverErrorData(error: unknown): JzPopoverErrorData {
  const httpError = error as HttpErrorResponse;

  const rawMessage =
    extractServerMessage(httpError) ||
    httpError.message ||
    'An unexpected error occurred.';

  const friendlyMessage = toFriendlyMessage(rawMessage);

  return {
    title: 'Market Data Error',
    message: friendlyMessage,
    technicalDetails: buildTechnicalDetails(httpError, rawMessage)
  };
}

function extractServerMessage(error: any): string {
  if (!error) {
    return '';
  }

  if (typeof error.error === 'string') {
    return error.error;
  }

  if (error.error?.message) {
    return error.error.message;
  }

  if (error.error?.title) {
    return error.error.title;
  }

  if (error.error?.detail) {
    return error.error.detail;
  }

  if (error.message) {
    return error.message;
  }

  return '';
}

function toFriendlyMessage(message: string): string {
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

function buildTechnicalDetails(error: any, rawMessage: string): string {
  return [
    `Status: ${error?.status ?? 'Unknown'}`,
    `Status Text: ${error?.statusText ?? 'Unknown'}`,
    `URL: ${error?.url ?? 'Unknown'}`,
    '',
    rawMessage
  ].join('\n');
}
