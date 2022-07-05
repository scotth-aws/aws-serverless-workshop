import { SideNavigation, SpaceBetween } from "@awsui/components-react";
import React, { useEffect, useState } from "react";

const Navigation = (current_user) => {
    const User = current_user.User;
    //console.log('Navigation '+JSON.stringify(current_user));
    const [NavigationItems, setNavigationItems] = useState([]);
    useEffect(() => {
        console.log('useEffect '+JSON.stringify(User));
        let navigation_items = [];
        if (User.isLoggedIn) {
            navigation_items.push({
                type: "section",
                text: "User logged in",
                expanded: true,
                items: [
                    { type: "link", text: 'username '+User.username},
                    { type: "link", text: 'Logout ', href: "/Logout"},
                ]
            });
            if (User.isOperator) {
                navigation_items.push({
                    type: "section",
                    text: "VOD Viewer",
                    expanded: true,
                    items: [
                        { type: "link", text: "View Videos", href: "/App" },
                        { type: "link", text: "Change Subcription", href: "/Subscription" }

                    ]
                });
            }
            if (User.isAdmin) {
                navigation_items.push({
                    type: "section",
                    text: "VOD Administrator",
                    expanded: true,
                    items: [
                        { type: "link", text: "Upload Videos", href: "/Admin" }
                    ]
                });
            }
        }

        setNavigationItems(navigation_items);
    }, [User]);

    return (
        <SpaceBetween>
            <SideNavigation activeHref={0} items={NavigationItems} />
        </SpaceBetween>
    );
};

    export default Navigation;