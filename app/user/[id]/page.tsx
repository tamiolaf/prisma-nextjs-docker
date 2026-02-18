const User = async ({params}: {params: Promise<{id: string}>}) => {
    const { id } =  await params;
  return (
    <div>User ID: ${id}</div>
  )
}

export default User