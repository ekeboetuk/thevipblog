import { usePosts, useUsers } from '../hooks/fetchers';
import RecentPosts from './recentpost'
import { Widgetcard } from './cards'

export const Statistics = () => {
    const {posts, isLoading} = usePosts('s?sort=-_id');
    const {users} = useUsers();
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
            <table className="table table-striped placeholder-glow">
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

export const LatestPost = () => {
    return (
        <Widgetcard title="Latest Post">
            <div className="">
                <RecentPosts number={1} />
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