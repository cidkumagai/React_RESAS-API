
import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import classes from './style.module.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: Array(47).fill(false),
      prefectures: {},
      series: [],
    };
    this.changeSelect = this.changeSelect.bind(this);
  }

  // 47都道府県の一覧を取得
  componentDidMount() {
    fetch('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
      // eslint-disable-next-line no-undef
      headers: { 'X-API-KEY': process.env.REACT_APP_APIKEY },
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({ prefectures: res.result });
      });
  }

  // チェックボックスに変更があったときの処理
  changeSelect(index) {
    const selectedCopy = this.state.selected.slice();
    // selectedの真偽値を反転
    selectedCopy[index] = !selectedCopy[index];
    if (!this.state.selected[index]) {
      // チェックされていなかった場合はデータを取得
      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${
          index + 1
        }`,
        {
          // eslint-disable-next-line no-undef
          headers: { 'X-API-KEY': process.env.REACT_APP_APIKEY },
        },
      )
        .then((response) => response.json())
        .then((res) => {
          let tmp = [];
          Object.keys(res.result.data[0].data).some((i) => {
            tmp.push(res.result.data[0].data[i].value);
            if (i === '4') {
              return true;
            }
          });
          const resSeries = {
            name: this.state.prefectures[index].prefName,
            data: tmp,
          };
          this.setState({
            selected: selectedCopy,
            series: [...this.state.series, resSeries],
          });
        });
    } else {
      // チェック済みの場合はseriesから削除
      const seriesCopy = this.state.series.slice();
      for (let i = 0; i < seriesCopy.length; i++) {
        if (seriesCopy[i].name === this.state.prefectures[index].prefName) {
          seriesCopy.splice(i, 1);
        }
      }
      this.setState({
        selected: selectedCopy,
        series: seriesCopy,
      });
    }
  }

  // チェックボックスの生成
  renderItem(props) {
    return (
      <div key={props.prefCode} className={classes.checkbox}>
        <input
          type="checkbox"
          checked={this.state.selected[props.prefCode - 1]}
          onChange={() => this.changeSelect(props.prefCode - 1)}
        />
        {props.prefName}
      </div>
    );
  }

  // チャートを表示するかどうかの判定
  printChart() {
    if (this.state.series.length > 0) {
      // trueならチャート作成、表示
      const options = {
        title: {
          text: '',
        },
        xAxis: {
          title: {
            text: '年度',
          },
          categories: [1980, 1990, 2000, 2010, 2020],
          // 小数点刻みにしない
          allowDecimals: false,
        },
        yAxis: {
          title: {
            text: '人口数',
          },
          allowDecimals: false,
        },
        tooltip: {
          valueSuffix: '人',
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
            allowDecimals: false,
          },
        },
        series: this.state.series,
      };
      return <HighchartsReact highcharts={Highcharts} options={options} />;
    } else {
      return <></>;
    }
  }

  // チャート生成
  render() {
    const obj = this.state.prefectures;
    return (
      <div>
        <h1 className={classes.title}> 都道府県別人口推移 </h1>
        <section>
          <div className={classes.prefecture}>
            <p> 都道府県 </p>
            {Object.keys(obj).map((i) => this.renderItem(obj[i]))}
          </div>
        </section>
        <section>
          <div className={classes.chart}></div>
          {this.printChart()}
        </section>
      </div>
    );
  }
}

export default App;
