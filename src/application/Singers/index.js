import React,{useState,useEffect,useContext} from 'react';
import Horizen from '../../baseUI/horizen-item';
import Scroll from '../../components/scroll';
import { categoryTypes,alphaTypes } from '../../api/config';
import { NavContainer,ListContainer,List,ListItem } from "./style";

import { 
  getSingerList, 
  getHotSingerList, 
  changeEnterLoading, 
  changePageCount, 
  refreshMoreSingerList, 
  changePullUpLoading, 
  changePullDownLoading, 
  refreshMoreHotSingerList 
} from './store/actionCreators';
import {connect} from 'react-redux';

import Loading from '../../baseUI/loading';

// 首先引入
import  LazyLoad, {forceCheck} from 'react-lazyload';

import { CHANGE_CATEGORY,CHANGE_ALPHA,CategoryDataContext } from './data';



const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount'])
});
const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList());
    },
    updateDispatch(category, alpha) {
      dispatch(changePageCount(0));//由于改变了分类，所以pageCount清零
      dispatch(changeEnterLoading(true));//loading，现在实现控制逻辑，效果实现放到下一节，后面的loading同理
      dispatch(getSingerList(category, alpha));
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch(category, alpha, hot, count) {
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(count+1));
      if(hot){
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList(category, alpha));
      }
    },
    //顶部下拉刷新
    pullDownRefreshDispatch(category, alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changePageCount(0));//属于重新获取数据
      if(category === '' && alpha === ''){
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList(category, alpha));
      }
    }
  }
};  


// //mock 数据
// const singerList = [1, 2,3, 4,5,6,7,8,9,10,11,12].map (item => {
//   return {
//     picUrl: "https://p2.music.126.net/uTwOm8AEFFX_BYHvfvFcmQ==/109951164232057952.jpg",
//     name: "隔壁老樊",
//     accountId: 277313426,
//   }
// }); 

// 渲染函数，返回歌手列表
const renderSingerList = (singerList) => {
  console.log(singerList)
  return (
    <List>
      {
        singerList.map ((item, index) => {
          return (
            <ListItem key={item.accountId+""+index}>
              <div className="img_wrapper">
              <LazyLoad placeholder={<img width="100%" height="100%" src={require ('../../assets/music.png')} alt="music"/>}>
                <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          )
        })
      }
    </List>
  )
};

function Singers (props) {  
  const {singerList,updateDispatch,getHotSingerDispatch,pullUpRefreshDispatch,pageCount,pullDownRefreshDispatch,enterLoading,pullUpLoading,pullDownLoading}=props
  console.log(props)
	// let [category,setCategogy]=useState('')
  // let [alpha,setAlpha]=useState('')
  
  // 首先需要引入 useContext
// 将之前的 useState 代码删除
const {data, dispatch} = useContext(CategoryDataContext);
// 拿到 category 和 alpha 的值
console.log(useContext(CategoryDataContext))
const {category, alpha} = data.toJS();
  if(!singerList.length){
    
  }
	let handleUpdateAlpha=(val)=>{
    dispatch ({type: CHANGE_ALPHA, data: val});
    updateDispatch(category, val);
	}
	let handleUpdateCategory=(val)=>{
    dispatch ({type: CHANGE_CATEGORY, data: val});
    updateDispatch(val, alpha);
  }
  const handlePullUp = () => {
    pullUpRefreshDispatch (category, alpha, category === '', pageCount);
  };
  
  const handlePullDown = () => {
    pullDownRefreshDispatch (category, alpha);
  };

  useEffect(()=>{
		if(!singerList.length){
      getHotSingerDispatch()
    }
	},[])

  return (
		<div>
			<NavContainer>
				<Horizen list={categoryTypes} handleClick={handleUpdateCategory} oldVal={category} title={"分类 (默认热门):" }></Horizen>
				<Horizen list={alphaTypes} handleClick={handleUpdateAlpha} oldVal={alpha} title={"首字母:"}></Horizen>
			</NavContainer>
			<ListContainer>
        { enterLoading ? <Loading></Loading> : null }
				<Scroll  pullUp={ handlePullUp }
          pullDown = { handlePullDown }
          pullUpLoading = { pullUpLoading }
          pullDownLoading = { pullDownLoading }
          onScroll={forceCheck}
        >
          { renderSingerList(singerList) }
				</Scroll>
			</ListContainer>
		</div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));