import React from "react";
import {Menu} from "semantic-ui-react";
import {Link} from '../routes';

const Header = () => {
    return (
        <Menu style={{ marginTop: 24 }}>
            <Link route="/">
                <a className="item">
                    Crowd Coin
                </a>
            </Link>
            <Menu.Menu position="right">
                <Link route="/">
                    <a className="item">
                        Campaigns
                    </a>
                </Link>
                <Link route="/campaigns/new">
                    <a className="item">
                        +
                    </a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
}

export default Header;
