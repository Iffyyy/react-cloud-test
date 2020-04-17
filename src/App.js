import React from 'react';
import './App.css';
import { GlobalStyle } from  './style';//全局样式
import { IconStyle } from './assets/iconfont/iconfont';//icon字体

// 路由配置
import routes from './routes/index.js';
import { renderRoutes } from 'react-router-config';//renderRoutes 读取路由配置转化为 Route 标签
import { HashRouter } from 'react-router-dom';

// redux
import { Provider } from 'react-redux'
import store from './store/index'

import { Data } from './application/Singers/data';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        <Data>
          { renderRoutes (routes) }
        </Data>
        {/* <i className="iconfont">&#xe62b;</i> */}
        {/* {renderRoutes(routes)} */}
      </HashRouter>
    </Provider>
  );
}

export default App;
