// React
import React, { Component } from "react";

import { OverlayTrigger, Tooltip, Row, Col, Button } from "react-bootstrap";

// Code editor
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";
// Code Theme
import "codemirror/theme/eclipse.css";
import "codemirror/theme/monokai.css";
// Code language
import "codemirror/mode/javascript/javascript";
// Code folders
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/mode/simple";

// Code Completion
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";

import "../../codemirror/restql";

// Module Components
import SaveModal from "./SaveModal";
import RevisionCombo from "./RevisionCombo";
import TenantCombo from "./TenantCombo";

export default class QueryEditor extends Component {
  render() {
    const {
      queryString,
      onQueryStringChange,
      queryParams,
      handleSaveQuery,
      handleRun,
      toggleModal,
      running,
      shouldLoadRevisions,
      revisions,
      handleLoadQueryRevision,
      onParamsChange,
      handleRunQuery,
      namespace,
      queryName,
      handleNamespaceChange,
      handleQueryNameChange,
      showModal,
      tenant,
      tenants,
      handleSetTenant,
      activeTenant,
      resourcesLink,
      resultString
    } = this.props;

    const baseOptions = {
      lineNumbers: true,
      tabSize: 2,
      mode: "restql",
      theme: "monokai",
      foldGutter: true,
      gutters: [
        "CodeMirror-linenumbers",
        "CodeMirror-foldgutter",
        "CodeMirror-brace-fold"
      ]
    };

    const editorOptions = {
      ...baseOptions,
      extraKeys: {
        "Shift-Enter": handleRun,
        "Ctrl-S": toggleModal,
        "Cmd-S": toggleModal,
        "Ctrl-Space": "autocomplete"
      },
      readOnly: running
    };

    const resultOptions = {
      ...baseOptions,
      mode: "javascript",
      readOnly: true
    };

    const runTooltip = (
      <Tooltip id="run-tooltip">
        <strong>Shift+Enter</strong>
      </Tooltip>
    );

    return (
      <Row>
        <Col sm={12} md={6} className="queryCol">
          <div className="queryTitle">
            <h3>
              Query
              {shouldLoadRevisions ? (
                this.props.loadRevisions()
              ) : (
                <RevisionCombo
                  toggle={revisions.length > 0}
                  revisions={revisions}
                  handleLoadQueryRevision={handleLoadQueryRevision}
                />
              )}
            </h3>
          </div>

          <CodeMirror
            className="queryInput"
            value={queryString}
            onChange={onQueryStringChange}
            options={editorOptions}
          />

          <Row>
            <Col sm={12} md={9}>
              <div className="from-group">
                <label>Parameters</label>
                <input
                  type="text"
                  className="form-control"
                  value={queryParams}
                  placeholder="name=test&age=18"
                  onChange={onParamsChange}
                />
              </div>

              <div className="options">
                <OverlayTrigger placement="bottom" overlay={runTooltip}>
                  <Button bsStyle="success" onClick={handleRunQuery}>
                    Run Query
                  </Button>
                </OverlayTrigger>

                <SaveModal
                  onSave={handleSaveQuery}
                  namespace={namespace}
                  queryName={queryName}
                  handleNamespaceChange={handleNamespaceChange}
                  handleQueryNameChange={handleQueryNameChange}
                  show={showModal}
                  toggleModal={toggleModal}
                  tooltip="Ctrl+S"
                />
              </div>
            </Col>

            <Col sm={12} md={3}>
              <TenantCombo
                className="from-group"
                tenant={tenant}
                tenants={tenants}
                handleSetTenant={handleSetTenant}
                activeTenant={activeTenant}
                resourcesLink={resourcesLink}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={12} md={6}>
          <h3>Result</h3>
          <CodeMirror
            className="queryResult"
            value={resultString}
            options={resultOptions}
          />
        </Col>
      </Row>
    );
  }
}
