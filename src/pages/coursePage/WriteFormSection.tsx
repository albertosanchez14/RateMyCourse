interface WriteFormSectionProps {
  setShowWriteForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WriteFormSection({
  setShowWriteForm,
}: WriteFormSectionProps) {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-xl border border-[#e0e0e0] bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-800 text-center">
        Share Your Experience!
      </h3>
      <div className="flex flex-row justify-center items-center gap-3">
        {[1, 2, 3, 4, 5].map((value) => (
          <div key={value} className="relative">
            <input
              type="radio"
              id={`rating-${value}`}
              name="rating"
              value={value}
              className="hidden peer"
              onClick={() => setShowWriteForm(true)}
            />
            <label
              htmlFor={`rating-${value}`}
              className="flex items-center justify-center w-10 h-10 rounded-full 
                bg-gray-100 hover:bg-gray-200 cursor-pointer
                peer-checked:bg-blue-500 peer-checked:text-white
                transition-all duration-200 font-medium"
            >
              {value}
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowWriteForm(true)}
        className="w-full py-3 px-4 bg-blue-500 text-white font-semibold 
          rounded-lg hover:bg-blue-600 active:bg-blue-700 
          transition-colors duration-200 shadow-sm"
      >
        Write a Review
      </button>
    </div>
  );
}
