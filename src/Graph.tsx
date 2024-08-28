import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    const schema = {
        price_abc: 'float',
        price_def: 'float',
        ratio: 'float',
        timestamp: 'date',
        upper_bound: 'float',
        lower_bound: 'float',
        trigger_alert: 'float',
    };

    // Initialise Perspective table with the schema
    this.table = window.perspective.worker().table(schema);

    // Makes sure this.table is defined before calling elem.load()
    if (this.table) {
      // Update Perspective configurations
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
          price_abc: 'avg',
          price_def: 'avg',
          ratio: 'avg',
          timestamp: 'distinct count',
          upper_bound: 'avg',
          lower_bound: 'avg',
          trigger_alert: 'avg'
      }));

      elem.load(this.table);
    }
  }

  componentDidUpdate() {
    if (this.table) {
        this.table.update(this.props.data.map((el: any) => {
            return {
                price_abc: el.price_abc,
                price_def: el.price_def,
                ratio: el.ratio,
                timestamp: el.timestamp,
                upper_bound: el.upper_bound,
                lower_bound: el.lower_bound,
                trigger_alert: el.trigger_alert,
            };
        }));
    }
  }
}

export default Graph;