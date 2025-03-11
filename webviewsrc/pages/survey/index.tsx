import { PageProps } from "../pageDefs";

export const SurveyPage = (props: PageProps) => {
    return (
        <div>
            Hello Survey Page! Let's GOOOOOO. Post is: {props.initialData.postConfig.intro}
        </div>
    );
};