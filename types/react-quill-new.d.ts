/* content is irrelevant, just renaming via overwrite/delete logic if I had a rename tool, but I don't. So I'll just create a new one and user can delete the old one or I can leave it. I will write to types/react-quill-new.d.ts */
declare module "react-quill-new" {
  import React from "react";
  interface ReactQuillProps {
    theme?: string;
    modules?: any;
    formats?: string[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
  }
  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
