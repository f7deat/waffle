import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import EditorjsList from '@editorjs/list';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
// @ts-ignore
import LinkTool from '@editorjs/link';
import Raw from '@editorjs/raw';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import SimpleImage from '@editorjs/simple-image';
import { Blogger } from './tools';
// @ts-ignore
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
// @ts-ignore
import Paragraph from 'editorjs-paragraph-with-alignment';
import ImageTool from '@editorjs/image';
import { api3rdUpload } from '@/services/file-service';

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: Table,
  list: {
    class: EditorjsList,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered'
    }
  },
  warning: Warning,
  code: Code,
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: `/api/work/block-editor/fetch-url`,
    },
  },
  raw: Raw,
  header: Header,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  blogger: Blogger,
  alignmentTune: {
    class: AlignmentTuneTool,
    config: {
      default: "right",
      blocks: {
        header: 'center',
        list: 'right'
      }
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool,
    config: {
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByFile(file: any) {
          const formData = new FormData();
          formData.append('file', file)
          return api3rdUpload(formData).then((response) => {
            return {
              success: 1,
              file: {
                url: response.url
              }
            };
          });
        }
      }
    }
  }
}