export interface EventRoot {
    addEventListener: Document['addEventListener'];
    removeEventListener: Document['removeEventListener'];
}

export interface Dialog {
    close: (force?: boolean) => boolean;
}

export class DialogManager {
    private dialogs: Dialog[] = [];

    constructor(private readonly deps: { eventRoot: EventRoot }) {}

    public register(dialog: Dialog): void {
        if (this.dialogs.length === 0) {
            this.deps.eventRoot.addEventListener('keydown', this.handleKeydown);
        }

        if (!this.dialogs.includes(dialog)) {
            this.dialogs.push(dialog);
        }
    }

    public forget(dialog: Dialog): void {
        this.dialogs = this.dialogs.filter((d) => d !== dialog);
        this.removeHandleKeydownEventListenerIfNecessary();
    }

    public readonly handleKeydown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.closeLatest(true);
        }
    }

    public closeLatest(force: boolean = false): void {
        const dialog = this.dialogs.pop();
        if (dialog) {
            if (dialog.close(force)) {
                this.removeHandleKeydownEventListenerIfNecessary();
            } else {
                this.dialogs.push(dialog);
            }
        }
    }

    private removeHandleKeydownEventListenerIfNecessary(): void {
        if (this.dialogs.length === 0) {
            this.deps.eventRoot.removeEventListener(
                'keydown',
                this.handleKeydown
            );
        }
    }
}
