import Link from "next/link"

const About = () => {
    return (
        <>
            <div className="text-3xl">About</div>
            <ul className="mt-10">
                <li><Link href="/user/1" >User 1 </Link></li>

                <li><Link href="/user/2" >User 2</Link></li >

                <li><Link href="/user/3">User 3</Link></li >

                <li><Link href="/user/4">User 4</Link></li >
            </ul >
        </>
    )
}

export default About