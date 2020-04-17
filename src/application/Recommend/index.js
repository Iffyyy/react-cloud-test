import React, { useEffect } from "react";
import { renderRoutes } from "react-router-config";
import Slider from '../../components/slider.js';
import RecommendList from '../../components/list';
import Scroll from '../../components/scroll';
import { Content } from './style';

import * as actionTypes from "./store/actionCreators";
import { connect } from "react-redux";

// 引入 forceCheck 方法
import { forceCheck } from 'react-lazyload';

import Loading from '../../components/loading/index';

// 映射Redux全局的state到组件路由的props
const mapStateToProp=(state)=>({
	bannerList:state.getIn(['recommend','bannerList']),
	recommendList:state.getIn(['recommend','recommendList']),
	enterLoading:state.getIn (['recommend', 'enterLoading'])
})
const mapDispatchToProps=(dispatch)=>{
	return {
		getBannerDataDispatch(){
			dispatch(actionTypes.getBannerList())
		},
		getRecommendListDataDispatch(){
			dispatch(actionTypes.getRecommendList())
		}
	}
}

function Recommend(props) {
	const {route,bannerList,recommendList,enterLoading}=props
	const {getBannerDataDispatch,getRecommendListDataDispatch}=props
	
	useEffect(()=>{
		if (!bannerList.size){
			getBannerDataDispatch ();
		}
		if (!recommendList.size){
			getRecommendListDataDispatch ();
		}
	},[])

	const bannerListJS=bannerList?bannerList.toJS():[]
	const recommendListJS=recommendList?recommendList.toJS():[]
	
  return <Content>
		<Scroll className="list" onScroll={forceCheck}>
			<div>
				<Slider bannerList={bannerListJS}></Slider>
				<RecommendList recommendList={recommendListJS}></RecommendList> 
			</div>
			{renderRoutes(route.routes)}
		</Scroll>
		{ enterLoading ? <Loading></Loading> : null }
	</Content>
}


export default connect(mapStateToProp,mapDispatchToProps)(React.memo(Recommend));
