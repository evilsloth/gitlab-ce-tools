export class Modal<INIT_DATA_TYPE> {
    modalOpen = true; // TODO: component or directive so close button wont have to be handled manually
    data: INIT_DATA_TYPE;

    setData(data: INIT_DATA_TYPE) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    close() {
        throw new Error('You must open this modal with ModalService first');
    }
}
