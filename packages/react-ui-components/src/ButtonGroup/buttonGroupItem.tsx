import React, {PureComponent} from 'react';

export type ButtonGroupItemId = string;

export interface ButtonGroupItemProps {
    readonly className?: string;
    readonly id: ButtonGroupItemId;
    readonly onClick: (id: ButtonGroupItemId) => void;
    readonly element: React.ReactElement<any>;
}

class ButtonGroupItem extends PureComponent<ButtonGroupItemProps> {
    public render(): JSX.Element {
        const {element, ...restProps} = this.props;
        return (
            React.cloneElement(element, {
                ...restProps,
                onClick: this.handleButtonClick
            })
        );
    }

    private readonly handleButtonClick = () => {
        this.props.onClick(this.props.id);
    }
}

export default ButtonGroupItem;
