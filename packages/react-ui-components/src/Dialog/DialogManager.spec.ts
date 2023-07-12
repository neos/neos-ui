import { DialogManager, Dialog, EventRoot } from './DialogManager';

describe('DialogManager', () => {
    describe('#register', () => {
        it('adds the `dialogManager.handleKeydown` event listener to the given event root if invoked for the first time', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = new DialogManager({ eventRoot });
            const dialog: Dialog = { close: jest.fn() };

            dialogManager.register(dialog);

            expect(eventRoot.addEventListener).toBeCalledWith(
                'keydown',
                dialogManager.handleKeydown
            );
        });

        it('does not add the event listener to the given event root on subsequent calls', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = new DialogManager({ eventRoot });
            const dialog1: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog2: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog3: Dialog = { close: jest.fn().mockReturnValue(true) };

            dialogManager.register(dialog1);
            dialogManager.register(dialog2);
            dialogManager.register(dialog3);

            expect(eventRoot.addEventListener).toBeCalledTimes(1);
        });

        it('re-adds the event listener to the given event root if invoked after all dialogs have been closed', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = new DialogManager({ eventRoot });
            const dialog1: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog2: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog3: Dialog = { close: jest.fn().mockReturnValue(true) };

            // Register dialogs
            dialogManager.register(dialog1);
            dialogManager.register(dialog2);
            dialogManager.register(dialog3);

            // Close all dialogs
            dialogManager.closeLatest();
            dialogManager.closeLatest();
            dialogManager.closeLatest();

            expect(eventRoot.addEventListener).toBeCalledTimes(1);

            // Register another dialog
            dialogManager.register(dialog1);

            expect(eventRoot.addEventListener).toBeCalledTimes(2);
        });
    });

    describe('#handleKeydown', () => {
        it('invokes `dialogManager.closeLatest` if the given event was an Escape-Keypress', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = Object.assign(
                new DialogManager({ eventRoot }),
                { closeLatest: jest.fn() }
            );
            const event: KeyboardEvent = {
                key: 'Escape',
            } as KeyboardEvent;

            dialogManager.handleKeydown(event);

            expect(dialogManager.closeLatest).toBeCalled();
        });
        it('does not invoke `dialogManager.closeLatest` if the given event was not an Escape-Keypress', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = Object.assign(
                new DialogManager({ eventRoot }),
                { closeLatest: jest.fn() }
            );

            dialogManager.handleKeydown({
                key: 'A',
            } as KeyboardEvent);

            expect(dialogManager.closeLatest).not.toBeCalled();

            dialogManager.handleKeydown({
                key: 'Foo',
            } as KeyboardEvent);

            expect(dialogManager.closeLatest).not.toBeCalled();
        });
    });

    describe('#closeLatest', () => {
        it('picks the latest registered dialog and invokes `dialog.close` on it', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = new DialogManager({ eventRoot });
            const dialog1: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog2: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog3: Dialog = { close: jest.fn().mockReturnValue(true) };

            dialogManager.register(dialog1);
            dialogManager.register(dialog2);
            dialogManager.register(dialog3);

            dialogManager.closeLatest();
            expect(dialog1.close).not.toHaveBeenCalled();
            expect(dialog2.close).not.toHaveBeenCalled();
            expect(dialog3.close).toHaveBeenCalled();

            dialogManager.closeLatest();
            expect(dialog1.close).not.toHaveBeenCalled();
            expect(dialog2.close).toHaveBeenCalled();
            expect(dialog3.close).toHaveBeenCalledTimes(1);

            dialogManager.closeLatest();
            expect(dialog1.close).toHaveBeenCalled();
            expect(dialog2.close).toHaveBeenCalledTimes(1);
            expect(dialog3.close).toHaveBeenCalledTimes(1);

            dialogManager.closeLatest();
            expect(dialog1.close).toHaveBeenCalledTimes(1);
            expect(dialog2.close).toHaveBeenCalledTimes(1);
            expect(dialog3.close).toHaveBeenCalledTimes(1);
        });

        it('removes the `dialogManager.handleKeydown` event listener from the given event root once all dialogs have been closed', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = new DialogManager({ eventRoot });
            const dialog1: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog2: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog3: Dialog = { close: jest.fn().mockReturnValue(true) };

            dialogManager.register(dialog1);
            dialogManager.register(dialog2);
            dialogManager.register(dialog3);

            dialogManager.closeLatest();
            dialogManager.closeLatest();

            expect(eventRoot.removeEventListener).not.toBeCalled();

            dialogManager.closeLatest();

            expect(eventRoot.removeEventListener).toBeCalledWith(
                'keydown',
                dialogManager.handleKeydown
            );

            dialogManager.closeLatest();

            expect(eventRoot.removeEventListener).toBeCalledTimes(1);
        });

        it('but `dialog.close` prevents a close by returning `false`', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = new DialogManager({ eventRoot });

            const closeMock = jest.fn();

            const dialog1: Dialog = { close: closeMock };

            // prevent close
            closeMock.mockReturnValue(false);

            dialogManager.register(dialog1);

            dialogManager.closeLatest();
            expect(dialog1.close).toHaveBeenCalledTimes(1);

            expect(eventRoot.removeEventListener).not.toBeCalled();

            closeMock.mockReturnValue(true);

            // allow close
            dialogManager.closeLatest();
            expect(dialog1.close).toHaveBeenCalledTimes(2);

            expect(eventRoot.removeEventListener).toBeCalledTimes(1);
        });

        it('closes a registered dialog only once, even if has been registered twice - in which case it uses order of first registration', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = new DialogManager({ eventRoot });
            const dialog1: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog2: Dialog = { close: jest.fn().mockReturnValue(true) };

            dialogManager.register(dialog1);
            dialogManager.register(dialog2);

            // Register dialog 1 again
            dialogManager.register(dialog1);

            dialogManager.closeLatest();
            expect(dialog1.close).not.toBeCalled();

            dialogManager.closeLatest();
            expect(dialog1.close).toBeCalled();
        });
    });

    describe('#forget', () => {
        it('removes a dialog from the stack', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = new DialogManager({ eventRoot });
            const dialog1: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog2: Dialog = { close: jest.fn().mockReturnValue(true) };
            const dialog3: Dialog = { close: jest.fn().mockReturnValue(true) };

            dialogManager.register(dialog1);
            dialogManager.register(dialog2);
            dialogManager.register(dialog3);

            dialogManager.forget(dialog2);

            dialogManager.closeLatest();
            dialogManager.closeLatest();
            dialogManager.closeLatest();

            expect(dialog1.close).toHaveBeenCalled();
            expect(dialog2.close).not.toHaveBeenCalled();
            expect(dialog3.close).toHaveBeenCalled();
        });

        it('removes the `dialogManager.handleKeydown` event listener from the given event root if the last remaining dialog is removed', () => {
            const eventRoot: EventRoot = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
            const dialogManager = new DialogManager({ eventRoot });
            const dialog: Dialog = { close: jest.fn().mockReturnValue(true) };

            dialogManager.register(dialog);
            dialogManager.forget(dialog);

            expect(eventRoot.removeEventListener).toHaveBeenCalled();
        });
    });
});
