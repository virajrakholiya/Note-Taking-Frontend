import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState(null);
  const [value, setValue] = useState({
    title: "",
    body: "",
  });
  const [updateValue, setUpdateValue] = useState({
    id: null,
    title: "",
    body: "",
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  // Show All Notes
  const fetchNotes = async () => {
    const res = await axios.get("https://note-taking-backend-dg2l.onrender.com/notes");
    console.log(res);
    setNotes(res.data.notes);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleUpdateChange = (e) => {
    // name = title value = body
    const { name, value } = e.target;
    setUpdateValue((prevUpdateValue) => ({
      ...prevUpdateValue,
      [name]: value,
    }));
  };

  const submithandler = async (e) => {
    e.preventDefault();
    const send = await axios.post("https://note-taking-backend-dg2l.onrender.com/notes", value);
    console.log(send);
    setNotes((prevNotes) => [...prevNotes, send.data.note]);
    setValue({
      title: "",
      body: "",
    });
  };

  const deleteHandler = async (_id) => {
    const del = await axios.delete(`https://note-taking-backend-dg2l.onrender.com/notes/${_id}`);
    console.log("Delete response:", del);

    const newList = notes.filter((note) => note._id !== _id);
    setNotes(newList);
  };

  const toogleUpdate = (item) => {
    console.log(item);
    setUpdateValue({
      id: item._id,
      title: item.title,
      body: item.body,
    });
  };

  const updateNote = async (e) => {
    e.preventDefault();
    const { title, body } = updateValue;
    const res = await axios.put(
      `https://note-taking-backend-dg2l.onrender.com/notes/${updateValue.id}`,
      { title, body }
    );
    const UpdatedNotes = [...notes];
    const notesIndex = notes.findIndex((note) => {
      return note._id === updateValue.id;
    });
    UpdatedNotes[notesIndex] = res.data.note;
    setNotes(UpdatedNotes);

    setUpdateValue({
      id: null,
      title: "",
      body: "",
    });
  };

  return (
    <div className="p-5 ">
      <div className="mb-5 flex flex-row gap-10 justify-center w-full ">
        {!updateValue.id && (
          <form
            className="flex flex-col gap-3 max-w-[400px] "
            onSubmit={submithandler}
          >
            <h1 className="text-5xl mb-3 text-center">Create Your Notes</h1>
            <input
              type="text"
              value={value.title}
              name="title"
              placeholder="Task Name"
              className="p-2"
              onChange={handleInputChange}
            />
            <textarea
              name="body"
              value={value.body}
              placeholder="Note"
              className="p-2"
              onChange={handleInputChange}
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        )}
        {/* update section */}
        {updateValue.id && (
          <form
            className="flex flex-col gap-5 w-[400px] "
            onSubmit={updateNote}
          >
            <h1 className="text-5xl mb-5 text-center">Edit Your Note</h1>

            <input
              type="text"
              className="p-2"
              name="title"
              value={updateValue.title}
              onChange={handleUpdateChange}
              placeholder="Title"
            />
            <textarea
              name="body"
              className="p-2"
              value={updateValue.body}
              onChange={handleUpdateChange}
              placeholder="Body"
            ></textarea>
            <button type="submit">Update</button>
          </form>
        )}
      </div>
      <div className="  gap-5 grid grid-cols-3 ">
        {notes &&
          notes.map((item) => (
            <div
              className=" gap-2  flex flex-col bg-mainBlack h-[200px]
              max-h[400px]  p-2 rounded-xl col-span-1 justify-between max-md:col-span-3"
              key={item._id}
            >
              <div className="flex flex-col ">
                <p className="text-2xl font-bold text-white  overflow-hidden overflow-ellipsis whitespace-pre-wrap break-words">
                  {item.title}
                </p>
                <p className="text-white text-lg overflow-hidden overflow-ellipsis whitespace-pre-wrap break-words">
                  {item.body}
                </p>
              </div>
              <div className="flex flex-row gap-2 justify-around">
                {" "}
                <button
                  className="bg-green-500"
                  onClick={() => toogleUpdate(item)}
                >
                  Update
                </button>
                <button
                  className="bg-red-400"
                  onClick={() => deleteHandler(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
