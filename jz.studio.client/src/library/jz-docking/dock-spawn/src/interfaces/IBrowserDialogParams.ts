
export interface BrowserDialogParams {
  title: string | null | undefined, // title can be a string, null, or undefined
  closeCallback?: () => void,
  newWindowClosedCallback?: () => void,
  focused: (e: FocusEvent) => void,
  blured: (e: FocusEvent) => void,
}
