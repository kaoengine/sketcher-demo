import * as appActions from '../actions/appActions';

import Sketcher from 'sketcherjs';
import RaisedButton from 'material-ui/RaisedButton';
import ReactDOM from 'react-dom';
import Tooltip from 'rc-tooltip';
import React, { Component, PropTypes } from 'react';
import { Map, List, is, fromJS } from 'immutable';
import { connect } from 'react-redux';

class HighlightApp extends Component {
  state = {
    cursor: "PEN"
  }

  constructor(props) {
    super(props);
    this.nodeRender = this.nodeRender.bind(this)
    this.customRendererWithTool = this.customRendererWithTool.bind(this)

  }

  onTextHighlighted(range) {
    this.props.highlightRange(range);
    window.getSelection().removeAllRanges();
  }

  nodeRender(lettersNode) {
    return <span>{lettersNode}</span>
  }

  tooltipRenderer(lettersNode, range, rangeIndex, onMouseOverHighlightedWord) {
    return (
      <Tooltip key={`${range.data.id}-${rangeIndex}`}
        onVisibleChange={onMouseOverHighlightedWord.bind(this, range)}
        placement="top"
        overlay={<div><RaisedButton
          label={'Reset highlights'}
          onClick={this.resetHightlight.bind(this, range)} /></div>}
        defaultVisible={true}
        animation="zoom">
        {this.nodeRender(lettersNode)}
      </Tooltip>);
  }

  customRendererWithToolTip(currentRenderedNodes, currentRenderedRange, currentRenderedIndex, onMouseOverHighlightedWord) {
    console.log('currentRenderedNodes', currentRenderedNodes);

    return this.tooltipRenderer(
      currentRenderedNodes,
      currentRenderedRange,
      currentRenderedIndex,
      onMouseOverHighlightedWord);
  }

  resetHightlight(range) {
    this.props.removeHighlightRange(range);
  }

  customRendererWithTool(currentRenderedNodes) {
    return this.nodeRender(
      currentRenderedNodes
    )
  }

  renderCursor() {
    console.log('ABC', this.state);

    const { cursor } = this.state;
    switch (cursor) {
      case "MOUSE":
        return "auto";
      case "PEN":
        return "url(http://www.rw-designer.com/cursor-extern.php?id=135769), auto"
      case "ERASER":
        return "url(http://www.rw-designer.com/cursor-extern.php?id=72976), auto"
      default:
        break;
    }
  }


  render() {
    console.log(this.state);
    
    return (
      <div className="row center-xs">
        <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11">
          <h1>Simple highlight example</h1>
          <Sketcher ranges={this.props.ranges.get('1', new List()).toJS()}
            enabled={true}
            style={{ textAlign: 'left' }}
            onTextHighlighted={this.onTextHighlighted.bind(this)}
            id={'1'}
            highlightStyle={{
              backgroundColor: '#ffcc80'
            }}
            text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae magna lacus. Sed rhoncus tortor eget venenatis faucibus. Vivamus quis nunc vel eros volutpat auctor. Suspendisse sit amet lorem tristique lectus hendrerit aliquet. Aliquam erat volutpat. Vivamus malesuada, neque at consectetur semper, nibh urna ullamcorper metus, in dapibus arcu massa feugiat erat. Nullam hendrerit malesuada dictum. Nullam mattis orci diam, eu accumsan est maximus quis. Cras mauris nibh, bibendum in pharetra vitae, porttitor at ante. Duis pharetra elit ante, ut feugiat nibh imperdiet eget. Aenean at leo consectetur, sodales sem sit amet, consectetur massa. Ut blandit erat et turpis vestibulum euismod. Cras vitae molestie libero, vel gravida risus. Curabitur dapibus risus eu justo maximus, efficitur blandit leo porta. Donec dignissim felis ac turpis pharetra lobortis. Sed quis vehicula nulla.'}
          />

          <h1>Example with tooltip</h1>
          <Sketcher ranges={this.props.ranges.get('2', new List()).toJS()}
            enabled={true}
            style={{ textAlign: 'left' }}
            onTextHighlighted={this.onTextHighlighted.bind(this)}
            id={'2'}
            highlightStyle={{
              backgroundColor: '#ffcc80'
            }}
            rangeRenderer={this.customRendererWithToolTip.bind(this)}
            text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae magna lacus. Sed rhoncus tortor eget venenatis faucibus. Vivamus quis nunc vel eros volutpat auctor. Suspendisse sit amet lorem tristique lectus hendrerit aliquet. Aliquam erat volutpat. Vivamus malesuada, neque at consectetur semper, nibh urna ullamcorper metus, in dapibus arcu massa feugiat erat. Nullam hendrerit malesuada dictum. Nullam mattis orci diam, eu accumsan est maximus quis. Cras mauris nibh, bibendum in pharetra vitae, porttitor at ante. Duis pharetra elit ante, ut feugiat nibh imperdiet eget. Aenean at leo consectetur, sodales sem sit amet, consectetur massa. Ut blandit erat et turpis vestibulum euismod. Cras vitae molestie libero, vel gravida risus. Curabitur dapibus risus eu justo maximus, efficitur blandit leo porta. Donec dignissim felis ac turpis pharetra lobortis. Sed quis vehicula nulla.'}
          />

          <h1>Example with url and smiley</h1>
          <Sketcher ranges={this.props.ranges.get('3', new List()).toJS()}
            enabled={true}
            style={{ textAlign: 'left' }}
            onTextHighlighted={this.onTextHighlighted.bind(this)}
            id={'3'}
            highlightStyle={{
              backgroundColor: '#ffcc80'
            }}
            text={'Lorem ipsum dolor sit amet, http://www.google.fr consectetur adipiscing elit. In vitae magna lacus. Sed rhoncus tortor eget venenatis faucibus. Vivamus quis nunc vel eros volutpat auctor. Suspendisse sit amet lorem tristique lectus hendrerit aliquet. Aliquam erat volutpat. Vivamus malesuada, neque at consectetur semper, nibh urna ullamcorper metus, in dapibus arcu massa 😘 feugiat erat. Nullam hendrerit malesuada dictum. Nullam mattis orci diam, eu accumsan est maximus quis. Cras mauris nibh, bibendum in pharetra vitae, porttitor at ante. Duis pharetra elit ante, ut feugiat nibh imperdiet eget. Aenean at leo consectetur, sodales sem sit amet, consectetur massa. Ut blandit erat et turpis vestibulum euismod. Cras vitae molestie libero, vel gravida risus. Curabitur dapibus risus eu justo maximus, efficitur blandit leo porta. Donec dignissim felis ac turpis pharetra lobortis. Sed quis vehicula nulla.'}
          />

          <div>
            <h1>Example with tool set</h1>
            <Sketcher ranges={this.props.ranges.get('4', new List()).toJS()}
              enabled={true}
              style={{ textAlign: 'left', cursor: this.renderCursor() }}
              onTextHighlighted={this.onTextHighlighted.bind(this)}
              id={'4'}
              highlightStyle={{
                backgroundColor: '#ffcc80'
              }}
              rangeRenderer={this.customRendererWithTool.bind(this)}
              text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae magna lacus. Sed rhoncus tortor eget venenatis faucibus. Vivamus quis nunc vel eros volutpat auctor. Suspendisse sit amet lorem tristique lectus hendrerit aliquet. Aliquam erat volutpat. Vivamus malesuada, neque at consectetur semper, nibh urna ullamcorper metus, in dapibus arcu massa feugiat erat. Nullam hendrerit malesuada dictum. Nullam mattis orci diam, eu accumsan est maximus quis. Cras mauris nibh, bibendum in pharetra vitae, porttitor at ante. Duis pharetra elit ante, ut feugiat nibh imperdiet eget. Aenean at leo consectetur, sodales sem sit amet, consectetur massa. Ut blandit erat et turpis vestibulum euismod. Cras vitae molestie libero, vel gravida risus. Curabitur dapibus risus eu justo maximus, efficitur blandit leo porta. Donec dignissim felis ac turpis pharetra lobortis. Sed quis vehicula nulla.'}
            />
            <div>
              {/* <button onClick= {this.setState({cursor:"PEN"})}>PEN</button>
              <button onClick= {this.setState({cursor:"ERASER"})}>ERASER</button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ranges: state.app.get('ranges', new Map())
  };
}

function mapDispatchToProps(dispatch) {
  return {
    highlightRange: range => dispatch(appActions.highlightRange(range)),
    removeHighlightRange: range => dispatch(appActions.removeHighlightRange(range))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HighlightApp);
