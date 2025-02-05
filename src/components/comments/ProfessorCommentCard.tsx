// import "./ProfessorCommentCard.css";

import RectangleChart from "../course/RectangleChart";

export default function ProfessorCommentCard() {
  return (
    <div className="professor-comment-container">
      <div className="professor-comment-profile-container">
        <img
          src={"/blank-profile-picture.png"}
          alt="profile"
          className="professor-comment-profile"
        />
        <div>
          <span className="professor-comment-profile-user">John Doe</span>
          <span className="professor-comment-profile-date">12/12/2021</span>
        </div>
      </div>
      <div className="professor-comment-description-rating">
        <div className="professor-comment-description-container">
          <h3 className="title">Great professor</h3>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            lacinia, nisl eget ultricies aliquam, ligula ligula ultricies
            tortor, nec lacinia purus libero in lorem. Sed nec libero
            scelerisque, tincidunt nunc nec, luctus nulla. Integer nec
            scelerisque nunc. Nullam lacinia, nisl eget ultr
          </span>
        </div>
        <div className="professor-comment-rating-container">
          <div>
            <h4 className="professor-comment-rating-title">Difficulty</h4>
            <RectangleChart value={3} />
          </div>
          <div>
            <h4 className="professor-comment-rating-title">Workload</h4>
            <RectangleChart value={4} />
          </div>
          <div>
            <h4 className="professor-comment-rating-title">Rating</h4>
            <RectangleChart value={5} />
          </div>
        </div>
      </div>
    </div>
  );
}