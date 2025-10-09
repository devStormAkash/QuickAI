import sql from "../configs/db.js"


export const getCreations = async(req,res) => {
  try {
    const { userId } = req.auth()
    const creations =  await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`
    res.json({success:true , content : creations })
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}



export const getPublishedCreations = async (req, res) => {
  try {
    
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
    res.json({ success: true, content: creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// export const toggleLikeCreation = async (req, res) => {
//   try {
//     const { userId } = req.auth();
//     const { id } = req.body
    
//     const [creation] = await sql`SELECT * FROM creations where id = ${id}`
//     if (!creation) {
//       return res.json({success:false , message : 'Creation Not Found'})
//     }

//     let message;
//     if (creation.likes.includes(userId)) {
//       creation.likes = creation.likes.filter((userid) => userId.toString() !== userid)
//       message = 'Creation Unliked'
//     }
//     else {
//       creation.likes = [...creation.likes, userId.toString()]
//       message = "Creation Liked";
//     }
//     const formatedArray = `{${creation.likes.join(',')}}`

//     await sql`UPDATE creations SET likes = ${formatedArray} WHERE id = ${id}`
    
//     res.json({ success: true, message });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };



export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.json({ success: false, message: "Creation Not Found" });
    }

    // ✅ ensure likes is always an array
    let likes = creation.likes || [];
    let message;

    if (likes.includes(userId)) {
      likes = likes.filter((uid) => uid !== userId);
      message = "Creation Unliked";
    } else {
      likes = [...likes, userId];
      message = "Creation Liked";
    }

    // ✅ convert JS array → Postgres array string
    const formattedArray = `{${likes.join(",")}}`;

    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

    res.json({ success: true, message, likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
