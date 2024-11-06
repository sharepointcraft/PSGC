import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetExecuteEventParameters,
  ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';

export interface ICceCommandSetProperties {
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'CceCommandSet';

export default class CceCommandSet extends BaseListViewCommandSet<ICceCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized CceCommandSet');

    const compareOneCommand: Command = this.tryGetCommand('CCE');
    compareOneCommand.visible = false;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    const selectedRows = this.context.listView?.selectedRows;

    if (selectedRows && selectedRows.length > 0) {
      const documentId = selectedRows[0]?.getValueByName('_dlc_DocIdUrl.desc');
      const absoluteUrl = this.context.pageContext.web.absoluteUrl;
      const URL = `${absoluteUrl}/_layouts/15/DocIdRedir.aspx?ID=${documentId}`;

      console.log('Selected Rows:', selectedRows);
      console.log('Document ID:', documentId);
      console.log('Constructed URL:', URL);

      if (documentId) {
        navigator.clipboard.writeText(URL)
          .then(() => {
            alert('URL copied to clipboard successfully.');
          })
          .catch(err => {
            alert('Failed to copy the URL to clipboard: ' + err);
          });
      }
    }

    switch (event.itemId) {
      case 'CCE':
        // Additional logic for COMMAND_1 can go here if needed
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const compareOneCommand: Command = this.tryGetCommand('CCE');
    if (compareOneCommand) {
      const selectedRows = this.context.listView.selectedRows;

      if (selectedRows && selectedRows.length === 1) {
        const selectedRow = selectedRows[0];

        // Check if the item has a file extension (indicating it's a file)
        const fileName = selectedRow.getValueByName('FileLeafRef'); // 'FileLeafRef' holds the file name or folder name

        console.log('Selected Item Name:', fileName); // Debug log

        // Command visible only if fileName contains a dot (indicating a file extension)
        compareOneCommand.visible = fileName && fileName.includes('.');
      } else {
        compareOneCommand.visible = false;
      }
    }

    this.raiseOnChange();
  }
}
