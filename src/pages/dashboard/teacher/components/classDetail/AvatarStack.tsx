
const AvatarStack = ({ users }: any) => {
  return (
    <div className="flex items-center">
      {users.map((user:any , index: number ) => (
        <div
          key={index}
          className="w-10 h-10 rounded-full border-2 border-white -ml-3 first:ml-0 overflow-hidden bg-gray-300 flex items-center justify-center text-white font-bold"
          style={{ zIndex: users.length - index }}
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
      ))}
    </div>
  );
};

export default AvatarStack;