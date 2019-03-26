import React, {PureComponent} from 'react';

type DropDownItemId = string;

export interface DropDownItemProps {
    /**
     * The handler to call when clicking on the item of the DropDown.
     */
    readonly onClick: (id: DropDownItemId) => void;

    /**
     * The ID to reference the clicked item in the `onClick` handker.
     */
    readonly id: DropDownItemId;

    /**
     * The children to render within the anchor.
     */
    readonly children: React.ReactNode;

    readonly className: string;
}

class DropDownItem extends PureComponent<DropDownItemProps> {
    public render(): JSX.Element {
        const {children, ...rest} = this.props;

        return (
            <a
                {...rest}
                role="button"
                onClick={this.handleClick}
            >
                {children}
            </a>
        );
    }

    private readonly handleClick = () => {
        this.props.onClick(this.props.id);
    }
}

export default DropDownItem;
