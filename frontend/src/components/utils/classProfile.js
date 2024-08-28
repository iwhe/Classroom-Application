// import { useEffect } from "react";
// import { getClassProfile, getClassRoomDetails } from "../../services/classRoom";
// import { useParams } from "react-router-dom";

// const Classprofile = () => {
//     const [className, setName] = usestate(null)
//     const [description, setDescription] = usestate(null)
//     const [teacher, setTeacher] = usestate(null)
//     const [students , setStudents] = usestate([])
//     const { id } = useParams();

//   useEffect(() => {
//     const fetchClass = async () => {
//       console.log("ID FROM PROFILE ", id);
//       const response = await getClassRoomDetails(id);
//       console.log(response);
//     };
//     fetchClass();
//   }, []);

//   return <div className="container">Class Profile</div>;
// };

// export default Classprofile;
