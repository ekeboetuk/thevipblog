import { usePosts, useUsers } from '../hooks/fetchers';
import { Widgetcard } from './cards'
import { Subscription } from './forms';

export default function Sidebar({statistics, advertise, subscribe, trending, recentuser}){
    return (
        <>
            {statistics && <Statistics />}
            {advertise && <Advertise />}
            {subscribe && <Subscribe />}
            {trending && <Trending />}
            {recentuser && <RecentUser />}
        </>
    )
};

export const Statistics = () => {
    const {posts, isLoading} = usePosts('s?sort=-_id');
    const {users} = useUsers('s');
    const stats = {
        totalposts: 0,
        totalcomments: 0,
        totallikes: 0,
        totalviews: 0,
        totalusers: 0,
    };

    if(posts && users) {
        stats.totalposts += posts?.length
        stats.totalusers += users?.length
        posts?.forEach((post)=> {
            stats.totalcomments += post.comments.length
            stats.totallikes += post.meta.likes
            stats.totalviews += post.meta.views
        })
    }

    return (
        <Widgetcard title="Site Stats">
            <table className="table table-striped placeholder-glow fs-4">
                <tbody>
                    <tr>
                        <th scope="row">No. of Posts<i className="fas fa-caret-right"></i></th>
                        <td>{isLoading?<span className="placeholder col-6"></span>:stats?.totalposts||0}</td>
                    </tr>
                    <tr>
                        <th scope="row">No. of Comments<i className="fas fa-caret-right"></i></th>
                        <td>{isLoading?<span className="placeholder col-9"></span>:stats?.totalcomments||0}</td>
                    </tr>
                    <tr>
                        <th scope="row">Total Likes<i className="fas fa-caret-right"></i></th>
                        <td>{isLoading?<span className="placeholder col-8"></span>:stats?.totallikes||0}</td>
                    </tr>
                    <tr>
                        <th scope="row">Total Views<i className="fas fa-caret-right"></i></th>
                        <td>{isLoading?<span className="placeholder col-12"></span>:stats?.totalviews||0}</td>
                    </tr>
                    <tr>
                        <th scope="row">Total Users<i className="fas fa-caret-right"></i></th>
                        <td>{isLoading?<span className="placeholder col-3"></span>:stats?.totalusers||0}</td>
                    </tr>
                </tbody>
            </table>
        </Widgetcard>
    )
}

export const Advertise = () => {
    return (
        <Widgetcard title="Advertise Here">
            <p className="p-4 fs-5">Sell you products here at an affordable rate</p>
        </Widgetcard>
    )
}

export const Subscribe = () => {
    return (
        <Widgetcard title="Newsletter Subscription">
            <div className="p-4" style={{backgroundColor: 'rgba(116, 65, 93, 0.14)'}}>
                <p className="fs-5">Kindly fill and submit the form below to subscirbe to our periodic newsletters. We promise not to be intrusive.</p>
                <Subscription />
            </div>
        </Widgetcard>
    )
}

export const Trending = () => {
    return (
        <Widgetcard title="Trending">
            <div className="p-2">Trending conversation shows here</div>
        </Widgetcard>
    )
}

export const RecentUser = () => {
    return (
        <Widgetcard title="Recent User">
            <div className="p-2">Most recent user shows here</div>
        </Widgetcard>
    )
}