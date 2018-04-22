// React
import React, { Component } from "react";

import { OverlayTrigger, Tooltip, Row, Col, Button } from "react-bootstrap";
import * as queryStringUtil from "query-string";
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
  constructor(props) {
    super();
    this.state = {
      formValues: [],
      queryStringFurfles: ""
    };
  }

  handleChange(event) {
    console.info(event.target);
    // console.info(event.target)
    // console.info(event.target.name)
    // console.info(event.target.value)
    // this.setState({formValues: {
    //   ...this.state.formValues,
    //   [event.target.name]: event.target.value
    // }});

    console.info(this.state);
  }

  handleInputChange = (idx, type) => evt => {
    const newFormItems = this.state.formValues.map((formItem, sidx) => {
      if (idx !== sidx) return formItem;
      return { ...formItem, [type]: evt.target.value };
    });

    const queryStringFurfles = newFormItems.reduce((acc, curr) => {
      if (curr.key !== "") {
        const division = acc === "" ? "" : "&";
        const paramValue = curr.value !== "" ? `=${curr.value}` : "";
        return `${acc}${division}${curr.key}${paramValue}`;
      }
      return acc;
    }, "");

    console.info(queryStringFurfles);

    this.setState({
      formValues: newFormItems,
      queryStringFurfles: queryStringFurfles
    });
  };

  handleQueryChange = event => {
    const splitedQuery = event.target.value.split("&");
    // console.info(splitedQuery);

    const furflesTest = splitedQuery.reduce((acc, curr) => {
      const paramsSplited = curr.split("=");

      return acc.concat({
        key: paramsSplited[0],
        value: typeof paramsSplited[1] !== "undefined" ? paramsSplited[1] : ""
      });
    }, []);

    console.info(furflesTest);

    this.setState({
      formValues: furflesTest,
      queryStringFurfles: event.target.value
    });
  };

  handleAddItem = (type, refIndex) => evt => {
    const defaulValues = {
      key: "",
      value: ""
    };
    this.setState({
      formValues: this.state.formValues.concat([
        {
          ...defaulValues,
          [type]: evt.target.value
        }
      ]),
      lastFocus: `${type}-${refIndex}`,
      setFocus: true
    });
  };

  componentDidUpdate(prevProps, prevState) {
    // console.info();
    // console.info(this);
    if (this.state.setFocus) {
      this.refs[this.state.lastFocus].focus();
      this.setState({
        setFocus: false
      });
    }
  }

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
      onFurflesChange,
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

    // console.info(queryStringUtil.parse(queryParams));

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
        <Col sm={12}>
          <div className="from-group">
            <label>Parameters</label>
            <input
              type="text"
              className="form-control"
              //value={queryParams}
              value={this.state.queryStringFurfles}
              placeholder="name=test&age=18"
              //onChange={onParamsChange}
              onChange={this.handleQueryChange}
            />
          </div>
          <ul className={"list-params"}>
            {this.state.formValues.map((formItem, index) => {
              return (
                <li key={`formItem-${index}`} className={"param-item"}>
                  <input
                    type="text"
                    className="form-control"
                    name={`key-${index}`}
                    ref={`key-${index}`}
                    value={formItem.key}
                    placeholder="key"
                    onChange={this.handleInputChange(index, "key")}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name={`value-${index}`}
                    ref={`value-${index}`}
                    value={formItem.value}
                    placeholder="value"
                    onChange={this.handleInputChange(index, "value")}
                  />
                </li>
              );
            })}
            <li className={"param-item"}>
              <input
                type="text"
                className="form-control"
                name={`key`}
                value={""}
                placeholder="key"
                onKeyDown={this.handleAddItem(
                  "key",
                  this.state.formValues.length
                )}
              />
              <input
                type="text"
                className="form-control"
                name={`value`}
                value={""}
                placeholder="value"
                onKeyDown={this.handleAddItem(
                  "value",
                  this.state.formValues.length
                )}
              />
            </li>
          </ul>
        </Col>
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
