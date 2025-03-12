import {PageProps} from "../pageDefs";
import {ConfigureSection} from "./configureTypes";

export type ConfigureHeaderProps = PageProps & {
    activeMenu: ConfigureSection;
    setActiveSection: (section: ConfigureSection)=>void;
};

export const ConfigureHeader = (props: ConfigureHeaderProps) => {
    const menuItems = [];
    for (let code in ConfigureSection) {
        if (!ConfigureSection.hasOwnProperty(code)) continue;
        menuItems.push(<li
            key={code}
            onClick={() => props.setActiveSection(ConfigureSection[code])}
            className={props.activeMenu === ConfigureSection[code] ? 'active' : ''}>{ConfigureSection[code]}</li>);
    }

    return (
        <header>
            <div>
                <h1>{props.initialData.postConfig.title}</h1>
            </div>
            <div>
                <nav>
                    <ul>
                        {menuItems}
                    </ul>
                </nav>
            </div>
            <div>
                <button>Draft</button>
            </div>
        </header>
    )
};