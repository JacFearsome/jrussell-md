import PropTypes from "prop-types";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import {
    Alignment,
    Button,
    Classes,
    Code,
    Divider,
    Drawer,
    Label,
    Position,
    Switch,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    FileInput,
} from "@blueprintjs/core";
import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";
import { saveAs } from 'file-saver';
import Files from 'react-files'
import "react-mde/lib/styles/css/react-mde-all.css";
import 'github-markdown-css/github-markdown.css';
const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    ghCompatibleHeaderId: true,
});
converter.setFlavor('github');

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: "",
            isOpen: false,
            selectedTab: "write",
            filename: "file.md",
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    fileReader;

    handleFileRead = (e) => {
        const content = this.fileReader.result;
        this.setState({ file: content });
    };

    handleFileChosen = (files) => {
        let file = files[0];
        this.fileReader = new FileReader();
        this.fileReader.onloadend = this.handleFileRead;
        this.setState({ filename: file.name })
        this.fileReader.readAsText(file);
    };

    onLoad(editor) {
        console.log("Ace editor loaded...");
    }

    onChange = (newValue) => {
        this.setState({ file: newValue });
    }

    handleOpen = () => {
        this.setState({ isOpen: true });
    }

    handleClose = () => {
        this.setState({ isOpen: false });
    }
    
    onFilesError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    setSelectedTab = () => {
        if (this.state.selectedTab == "write") {
            this.setState({selectedTab: "preview"})
        } else {
            this.setState({selectedTab: "write"})
        }
    }
    saveFile = () => {
        let blob = new Blob([this.state.file], {type: "text/plain;charset=utf-8"});
        saveAs(blob, this.state.filename);
    }
    renderHotkeys() {
        return <Hotkeys>
            <Hotkey
                global={true}
                combo="ctrl+s"
                label="Save File"
                onKeyDown={this.saveFile}
                preventDefault={true}
            />
        </Hotkeys>;
    }
    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>Markdown Editor</Navbar.Heading>
                        <Navbar.Divider />
                        <Files
                            className='files-dropzone'
                            onChange={this.handleFileChosen}
                            onError={this.onFilesError}
                            accepts={['.md']}
                            maxFiles={1}
                            maxFileSize={10000000}
                            minFileSize={0}
                            clickable
                        ><Button className="bp3-minimal" icon="upload" text="">Load Local File</Button></Files>
                        <Button onClick={this.saveFile} className="bp3-minimal" icon="floppy-disk" text="Save Local File" />
                        <Button onClick={this.handleOpen} className="bp3-minimal" icon="document-open" text="Keyboard Shortcuts" />
                    </Navbar.Group>
                </Navbar>
                <Drawer
                    icon="document"
                    onClose={this.handleClose}
                    title="Keyboard Shortcuts"
                    isOpen={this.state.isOpen}
                >
                    <div className={Classes.DRAWER_BODY}>
                        <div className={Classes.DIALOG_BODY}>
                            <Hotkeys>
                                <Hotkey preventDefault label="Save" combo="ctrl+s" preventDefault={true} global onKeyDown={this.saveFile} />
                            </Hotkeys>
                        </div>
                    </div>
                    <div className={Classes.DRAWER_FOOTER}></div>
                </Drawer>
                <div className="row">
                    <div className="column">
                        <ReactMde
                            value={this.state.file}
                            onChange={this.onChange}
                            minEditorHeight="800px"
                            generateMarkdownPreview={false}
                        />
                    </div>
                    <div className="column preview">
                        <ReactMarkdown className="markdown-body" source={this.state.file} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;