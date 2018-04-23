// React
import React, { Component } from "react";

// Redux actions
import { connect } from "react-redux";

// Application Logic
import {
  // UI Operations
  handleNewQuery,
  handleShowModal,
  handleToggleSidebar,

  // Listeners
  handleParamsChange,
  handleNamespaceChange,
  handleQueryNameChange,
  handleQueryStringChange,
  handleFurfles,

  // Business logic operations
  handleLoadNamespaces,
  handleLoadQueries,
  handleLoadQuery,
  handleRunQuery,
  handleSaveQuery,
  handleLoadRevisions,
  handleLoadQueryRevision
} from "../../actions/queryActionCreator";

import {
  handleLoadTenants,
  handleSetTenant
} from "../../actions/environmentActionCreator";

// CSS for this screen and logo
import "./QueryEditorScreen.css";
import Logo from "../restQL-logo.svg";

// Custom Components for this screen
import QueryNavbar from "./QueryNavbar";
import QuerySidebar from "./QuerySidebar";
import QueryEditor from "./QueryEditor";

class QueryEditorScreen extends Component {
  constructor(props) {
    super(props);
    handleLoadNamespaces();

    if (this.props.tenants.length === 0) handleLoadTenants();
  }

  render() {
    return (
      <QuerySidebar
        className="QueryEditorScreen"
        loadingNamespaces={this.props.loadingNamespaces}
        loadingQueries={this.props.loadingQueries}
        showSidebar={this.props.showSidebar}
        namespaces={this.props.namespaces}
        namespace={this.props.namespace}
        collapsedNamespace={this.props.collapsedNamespace}
        queries={this.props.queries}
        toggleSidebar={handleToggleSidebar}
        loadQueries={handleLoadQueries}
        loadQuery={handleLoadQuery}
      >
        <QueryNavbar
          logo={Logo}
          toggleSidebar={handleToggleSidebar}
          newQuery={handleNewQuery}
        />

        <div className="container">
          <QueryEditor
            // General props
            revisions={this.props.revisions}
            namespace={this.props.namespace}
            queryName={this.props.queryName}
            queryString={this.props.queryString}
            queryParams={this.props.queryParams}
            resultString={this.props.resultString}
            running={this.props.running}
            // Env props
            tenant={this.props.tenant}
            tenants={this.props.tenants}
            handleSetTenant={handleSetTenant}
            activeTenant={this.props.activeTenant}
            resourcesLink={"/resources-editor"}
            // Modal options and listeners
            showModal={this.props.showModal}
            toggleModal={handleShowModal}
            handleNamespaceChange={handleNamespaceChange}
            handleQueryNameChange={handleQueryNameChange}
            // RevisionCombo props
            shouldLoadRevisions={this.props.shouldLoadRevisions}
            loadRevisions={handleLoadRevisions}
            handleLoadQueryRevision={handleLoadQueryRevision}
            // Listeners to run query
            onQueryStringChange={handleQueryStringChange}
            onParamsChange={handleParamsChange}
            onFurflesChange={handleFurfles}
            // Actions
            handleRun={handleRunQuery}
            handleSaveQuery={handleSaveQuery}
            handleRunQuery={handleRunQuery}
          />
        </div>
      </QuerySidebar>
    );
  }
}

const mapStateToProps = state => ({
  queryString: state.queryReducer.query,
  queryParams: state.queryReducer.queryParams,
  resultString: state.queryReducer.queryResult,
  running: state.queryReducer.running,
  queryName: state.queryReducer.queryName,
  namespaces: state.queryReducer.namespaces,
  namespace: state.queryReducer.namespace,
  loadingQueries: state.queryReducer.loadingQueries,
  queries: state.queryReducer.queries,
  collapsedNamespace: state.queryReducer.collapsedNamespace,
  loadingNamespaces: state.queryReducer.loadingNamespaces,
  revisions: state.queryReducer.revisions,
  shouldLoadRevisions: state.queryReducer.shouldLoadRevisions,
  showModal: state.queryReducer.showModal,
  showSidebar: state.queryReducer.showSidebar,

  // Env configurations
  tenants: state.environmentReducer.tenants,
  tenant: state.environmentReducer.tenant,
  activeTenant: state.environmentReducer.activeTenant
});

export default connect(mapStateToProps, null)(QueryEditorScreen);
