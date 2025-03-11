import {PageProps} from "../pageDefs";
import {ConfigureHeader} from "./ConfigurationHeader";
import {QuestionList} from "./QuestionList";
import './styles.css';
import {useState} from "react";
import {ConfigureSection} from './configureTypes';

export const ConfigurePage = (props: PageProps) => {

    const [activeSection, setActiveSection] = useState<ConfigureSection>(ConfigureSection.questions);

    return (
        <div id="configure">
            <ConfigureHeader setActiveSection={setActiveSection} activeMenu={activeSection} {...props} />
            {activeSection === ConfigureSection.questions && (<QuestionList {...props} />)}
            {activeSection === ConfigureSection.results && (<div>Results Later</div>)}
            {activeSection === ConfigureSection.settings && (<div>Settings Later</div>)}
        </div>
    );
};