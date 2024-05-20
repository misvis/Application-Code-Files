export default function Header(){
    return (
        <nav className="app-header">
            <ul className="app-flex wrap justify-between align-center">
                <li>
                    <a href="#">Demo App</a>
                </li>
                <li class="app-header__menuItems">
                    <ul>
                        <li className="app-flex align-center wrap">
                            <a href="#">Profile</a>
                            <a href="#">Settings</a>
                            <a href="#">Logout</a>  
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}