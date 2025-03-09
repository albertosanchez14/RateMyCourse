import "./ProfessorCommentCard.css";

import RectangleChart from "../../pages/coursePage/RectangleChart";
import Comment from "./Comment";

import { CommentProfessorType, Professor } from "../../types/comments_type";

interface ProfessorCommentCardProps {
  professor: Professor;
  comments: Array<CommentProfessorType>;
}

export default function ProfessorCommentCard({
  professor,
  comments,
}: ProfessorCommentCardProps) {
  console.log(professor, comments);

  return (
    <div className="professor-comment-container">
      <div className="professor-comment-profile-container">
        <div className="professor-comment-profile">
          <h2 className="professor-name">{professor.name}</h2>
          <span>{professor.department} Department</span>
        </div>
        <div className="professor-comment-rating-container">
          <h3>Overall Rating</h3>
          <RectangleChart rating={professor.rating.overall} />
        </div>
      </div>
      <div className="professor-comment-list-container">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            id={comment.id}
            title={comment.title}
            date={comment.date}
            description={comment.description}
            rating={comment.rating}
            by={comment.by}
          />
        ))}
      </div>
    </div>
  );
}
