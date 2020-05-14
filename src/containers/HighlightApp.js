import * as appActions from '../actions/appActions';

import Sketcher from 'sketcherjs';
import RaisedButton from 'material-ui/RaisedButton';
import Tooltip from 'rc-tooltip';
import React, { Component, PropTypes, Fragment } from 'react';
import { Map, List, is, fromJS } from 'immutable';
import { connect } from 'react-redux';

class HighlightApp extends Component {
  state = {
    cursor: "PEN",
    cursorUrl: '',
    markerColor: '#ffcc80'
  }

  constructor(props) {
    super(props);
    this.nodeRender = this.nodeRender.bind(this)
    this.customRendererWithTool = this.customRendererWithTool.bind(this)
    this.onTextHighlightedHandler = this.onTextHighlightedHandler.bind(this)
    this.onTextHighlighted = this.onTextHighlighted.bind(this)

  }

  onTextHighlighted(range) {
    console.log('onTextHighlighted', range);

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
    console.log('currentRenderedNodes', currentRenderedNodes);
    return this.nodeRender(
      currentRenderedNodes
    )
  }

  renderStateCursor(cursor) {
    switch (cursor) {
      case "MOUSE":
        return { ...this.state, cursor: 'MOUSE', cursorUrl: "auto" };
      case "PEN":
        return { ...this.state, cursor: 'PEN', cursorUrl: "url(http://www.rw-designer.com/cursor-extern.php?id=135769), auto" }
      case "ERASER":
        return { ...this.state, cursor: 'ERASER', cursorUrl: "url(http://www.rw-designer.com/cursor-extern.php?id=72976), auto", }
      default:
        break;
    }
  }

  setCursor(cursorType) {
    console.log('cursorType', cursorType);
    const { cursorUrl, markerColor, cursor } = this.renderStateCursor(cursorType);
    console.log('cursorUrl, markerColor, cursor', cursorUrl, markerColor, cursor);

    this.setState({ cursorUrl, markerColor, cursor })
  }

  onTextHighlightedHandler(range) {
    const cursorType = this.state.cursor;
    console.log('onTextHighlightedHandler', { cursorType, range });

    if (cursorType == "PEN") {
      console.log("cursorType", 'PEN')
      return this.onTextHighlighted(range);
    } else if (cursorType == "ERASER") {
      console.log("cursorType ERASER", range)
      console.log('xx', this.props.ranges.get('4', new List()).toJS());
      const ranges = this.props.ranges.get('4', new List()).toJS();
      const parentRange = this.getParentRange(ranges, range);
      console.log('parentRange', parentRange);
      return this.resetHightlight(parentRange);
    } else {
      return this.onTextHighlighted(range);
    }
  }

  getParentRange(ranges, range) {
    return ranges.find(r => r.text.includes(range.text) && r.start <= range.start);
  }

  render() {
    console.log('RENDER()...');
    console.log('this', this.props);


    const styleCursorWrapper = { cursor: this.state.cursorUrl }

    const backgroundColor = {
      backgroundColor: this.state.markerColor
    }

    return (
      <div className="row center-xs">
        <div className="col-xs-11 col-sm-11 col-md-11 col-lg-11" style={styleCursorWrapper}>
          <h1>Simple highlight example</h1>
          <Sketcher
            ranges={this.props.ranges.get('1', new List()).toJS()}
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

          <h1>Example with tool set</h1>
          <Sketcher
            ranges={this.props.ranges.get('4', new List()).toJS()}
            enabled={true}
            style={{ textAlign: 'left' }}
            onTextHighlighted={this.onTextHighlightedHandler}
            id={'4'}
            highlightStyle={backgroundColor}
            rangeRenderer={this.customRendererWithTool.bind(this)}
            text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae magna lacus. Sed rhoncus tortor eget venenatis faucibus. Vivamus quis nunc vel eros volutpat auctor. Suspendisse sit amet lorem tristique lectus hendrerit aliquet. Aliquam erat volutpat. Vivamus malesuada, neque at consectetur semper, nibh urna ullamcorper metus, in dapibus arcu massa feugiat erat. Nullam hendrerit malesuada dictum. Nullam mattis orci diam, eu accumsan est maximus quis. Cras mauris nibh, bibendum in pharetra vitae, porttitor at ante. Duis pharetra elit ante, ut feugiat nibh imperdiet eget. Aenean at leo consectetur, sodales sem sit amet, consectetur massa. Ut blandit erat et turpis vestibulum euismod. Cras vitae molestie libero, vel gravida risus. Curabitur dapibus risus eu justo maximus, efficitur blandit leo porta. Donec dignissim felis ac turpis pharetra lobortis. Sed quis vehicula nulla.'}
          />
          <div>
            <button onClick={(e) => this.setCursor('PEN')}>PEN</button>
            <button onClick={(e) => this.setCursor('ERASER')}>ERASER</button>
            <button onClick={(e) => this.setCursor('ERASER_ALL')}>ERASER ALL</button>
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
