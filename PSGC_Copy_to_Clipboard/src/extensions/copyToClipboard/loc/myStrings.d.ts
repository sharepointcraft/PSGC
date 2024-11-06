declare interface ICopyToClipboardCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'CopyToClipboardCommandSetStrings' {
  const strings: ICopyToClipboardCommandSetStrings;
  export = strings;
}
