import Avatar from "../Avatar/Avatar";
import "./feed.css";

const Feed = () => {
  return (
    <div className="feed">
      {/* date */}
      <div className="feed_date">
        <Avatar />
        <p>2/22/2008</p>
      </div>
      {/* img */}
      <div className="feed_img">
        <img src="https://source.unsplash.com/random" alt="feed_image" />
      </div>
      {/* content */}
      <div className="feed_content">
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus
          rerum blanditiis a quibusdam? Dolorum labore praesentium eius tenetur
          inventore corrupti distinctio assumenda accusantium, officia
          consequatur?
        </p>
      </div>
    </div>
  );
};

export default Feed;
