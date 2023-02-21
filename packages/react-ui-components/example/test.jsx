import React from "react";
import { render } from "react-dom";
import { IconButton, Icon, Button, Headline, Logo,  ToggablePanel } from "../dist/index"

import './font.css'; // The components 

import {config, library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {faNeos} from '@fortawesome/free-brands-svg-icons/faNeos';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false; // Dont insert the supporting CSS into the <head> of the HTML document
library.add(
    fas,
    faNeos,
)

const App = () => (
    <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        width: "100px"
    }}>
        <Logo />
        <Headline type="h1">Hello</Headline>
        <ToggablePanel>
            <ToggablePanel.Header>
                Header
            </ToggablePanel.Header>
            <ToggablePanel.Contents>
                Marc Henry war hier ^^
            </ToggablePanel.Contents>
        </ToggablePanel>
        <IconButton icon="neos" />
        <Icon icon="swimming-pool" />
        <Button>Hallo Welt</Button>
    </div>
)

render(<App />, document.getElementById("app"))
