import { Button } from "./ui/button";

const Navbar = () => {
    return (
        <div className="bg-transparant flex p-4 gap-4">
            <div className="pt-2 pl-2 font-bold text-xl">
                Vakyadarpan
            </div>
            <Button className="font-bold text-lg" variant="ghost">About</Button>
            <Button className="font-bold text-lg" variant="ghost">Discover</Button>
            <div className="ml-auto font-bold text-xl pt-2">
                Search
            </div>
        </div>
    );
}
 
export default Navbar;