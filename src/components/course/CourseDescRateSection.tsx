// export default function CourseDescRateSection() {
//   return (
//     <div className="course-description-rating-container">
//               <div className="course-description-container">
//                 <div
//                   className="course-description-title-container"
//                   ref={descriptionTitleContRef}
//                 >
//                   <h3
//                     className="course-description-title"
//                     id="selected"
//                     onClick={handleDescriptionChange}
//                   >
//                     Objectives
//                   </h3>
//                   <h3
//                     className="course-description-title"
//                     id="unselected"
//                     onClick={handleDescriptionChange}
//                   >
//                     Skills and learning outcomes
//                   </h3>
//                   <h3
//                     className="course-description-title"
//                     id="unselected"
//                     onClick={handleDescriptionChange}
//                   >
//                     Description of contents
//                   </h3>
//                 </div>
//                 <p className="course-description" ref={descriptionRef}>
//                   {generateDescription(description)}
//                 </p>
//                 {isOverflowing && (
//                   <button
//                     className="course-description-load"
//                     onClick={handleLoadMoreDesc}
//                     ref={loadMoreButtonRef}
//                   >
//                     Load More
//                   </button>
//                 )}
//               </div>
//               <div className="course-rating-container" ref={ratingContainerRef}>
//                 {Object.entries(data.rating).map(([key, value]) => (
//                   <div
//                     className="course-rating-type-container"
//                     id={`course-rating-${key}-container`}
//                     key={key}
//                   >
//                     <h4 className="course-rating-title">
//                       {key === "overall"
//                         ? "Rating"
//                         : key.charAt(0).toUpperCase() + key.slice(1)}
//                     </h4>
//                     {key === "overall" ? (
//                       <SemiCircleChart rating={value as number} />
//                     ) : (
//                       <RectangleChart rating={value as number} />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//   );
// }