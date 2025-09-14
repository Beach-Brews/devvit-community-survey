import {
    PlusCircleIcon,
    StopCircleIcon,
    PresentationChartBarIcon,
    TrashIcon,
    PencilSquareIcon,
    CheckIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/solid';
import { ChangeEvent, Dispatch, JSX, SetStateAction, useState } from 'react';
import { navigateTo } from '@devvit/web/client';

interface SurveyLineItemProps {
    name: string;
    status: 'draft' | 'scheduled' | 'live' | 'closed';
    count: number;
    publishDate: string;
    closeDate: string;
    setPageContext: Dispatch<SetStateAction<DashboardPageContext>>;
    surveyId: number;
}

const SurveyLineItem = (props: SurveyLineItemProps) => {

    const actions: JSX.Element[] = [];

    switch (props.status) {
        case 'draft':
        case 'scheduled':
            actions.push(<div key={`${props.name}-edit`} onClick={()=> props.setPageContext({page: 'edit', surveyId: props.surveyId})} className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200"><PencilSquareIcon className="size-6" /></div>);
            actions.push(<div key={`${props.name}-delete`} className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200"><TrashIcon className="size-6" /></div>);
            break;
        case 'live':
            actions.push(<div key={`${props.name}-view`} className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200"><PresentationChartBarIcon className="size-6" /></div>);
            actions.push(<div key={`${props.name}-delete`} className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200"><StopCircleIcon className="size-6" /></div>);
            break;
        case 'closed':
            actions.push(<div key={`${props.name}-view`} className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200"><PresentationChartBarIcon className="size-6" /></div>);
            actions.push(<div key={`${props.name}-delete`} className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200"><TrashIcon className="size-6" /></div>);
            break;
    }

    return (
        <tr key={props.name} className="odd:bg-neutral-50 odd:dark:bg-neutral-900 even:bg-neutral-100 even:dark:bg-neutral-800 border-b dark:border-neutral-700 border-neutral-200">
            <th scope="row" className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap dark:text-white">
                {props.name} ({props.surveyId})
            </th>
            <td className="px-6 py-4 uppercase">
                {props.status}
            </td>
            <td className="px-6 py-4">
                {props.count > 0 ? props.count : '-'}
            </td>
            <td className="px-6 py-4">
                {props.publishDate}
            </td>
            <td className="px-6 py-4">
                {props.closeDate}
            </td>
            <td className="px-6 py-4 flex gap-2">
                {actions}
            </td>
        </tr>
    );
};

interface DashboardListProps {
    setPageContext: Dispatch<SetStateAction<DashboardPageContext>>;
}

const DashboardList = (props: DashboardListProps) => {
    return (
        <div>
            <div className="flex justify-between items-center border-b mb-4">
                <h1 className="text-md lg:text-2xl font-bold">Community Survey Dashboard</h1>
                <div className="my-4">
                    <button
                        className="border-2 border-lime-800 bg-lime-800 text-white px-2 py-1 rounded-lg text-small hover:font-semibold hover:bg-lime-700 flex gap-2 items-center cursor-pointer"
                        onClick={() => props.setPageContext({page: 'edit', surveyId: -1})}
                    >
                        <PlusCircleIcon className="size-6" />
                        <div>New</div>
                    </button>
                </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs uppercase text-neutral-800 bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Survey name</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Responses</th>
                        <th scope="col" className="px-6 py-3">Publish Date</th>
                        <th scope="col" className="px-6 py-3">Close Date</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <SurveyLineItem surveyId={540} setPageContext={props.setPageContext} name="Complete Survey" status="closed" count={75} publishDate="Mon 9/1/2025 9:00 AM" closeDate="Mon 9/8/2025 9:00 AM" />
                    <SurveyLineItem surveyId={541} setPageContext={props.setPageContext} name="Always Open" status="live" count={1557} publishDate="Mon 9/8/2025 9:00 AM" closeDate="-" />
                    <SurveyLineItem surveyId={542} setPageContext={props.setPageContext} name="Live Survey" status="live" count={23} publishDate="Mon 9/8/2025 9:00 AM" closeDate="Mon 9/15/2025 9:00 AM" />
                    <SurveyLineItem surveyId={543} setPageContext={props.setPageContext} name="Scheduled Survey" status="scheduled" count={0} publishDate="Mon 9/15/2025 9:00 AM" closeDate="Mon 9/22/2025 9:00 AM" />
                    <SurveyLineItem surveyId={544} setPageContext={props.setPageContext} name="Draft Survey" status="draft" count={0} publishDate="-" closeDate="-" />
                    </tbody>
                </table>
            </div>
            <div className="hidden">
                <h2>Tasks</h2>
                <ol>
                    <li>Create survey schema (questions and responses and sample-data)</li>
                    <li>Create survey create endpoint (check mod)</li>
                    <li>Create survey list endpoint (check mod)</li>
                    <li>Create survey post logic</li>
                    <li>Create survey publish check task</li>
                    <li>Redirect to dashboard view based on post type? - Or do I use blocks onky for survey and onky have dashboard as web view?</li>
                </ol>
                <h2>Basic POC Requirements</h2>
                <ul>
                    <li>Create Button</li>
                    <li>List (Get) Surveys</li>
                    <li>Edit or Delete Unpublished</li>
                    <li>Close Published</li>
                    <li>Delete Closed</li>
                    <li>View Results</li>
                </ul>
                <ul>
                    <li>128 Char max question</li>
                    <li>512 character max description</li>
                    <li>Single choice (radio) (max 5)</li>
                    <li>Scale (1-5 or 1-10)</li>
                    <li>Multi choice (checkbox) (max 5)</li>
                    <li>Rank (max 5)</li>
                    <li>Short input (view by mod only, form popup, 500 limit)</li>
                </ul>
            </div>
        </div>
    );
};

interface SurveyEditorProps {
    pageContext: SurveyIdPageContext;
    setPageContext: Dispatch<SetStateAction<DashboardPageContext>>;
}

export const SurveyEditor = (props: SurveyEditorProps) => {
    // Form states
    const [formIntro, setFormIntro] = useState<string>('');
    const introOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setFormIntro(e.target.value);
    };

    const now = new Date();
    const nowStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return (
        <div>
            <div className="flex justify-between items-center border-b mb-4">
                <h1 className="text-2xl font-bold">Survey Editor - Id: {props.pageContext.surveyId}</h1>
                <div className="m-4 mr-0 flex justify-between items-center gap-4">
                    <button
                        className="border-2 border-blue-800 bg-blue-800 text-white px-2 py-1 rounded-lg text-small hover:font-semibold hover:bg-blue-700 flex gap-2 items-center cursor-pointer"
                        onClick={() => props.setPageContext({page: 'list'})}
                    >
                        <CalendarDaysIcon className="size-6" />
                        <div>Schedule</div>
                    </button>
                    <button
                        className="border-2 border-slate-600 bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-50 px-2 py-1 rounded-lg text-small hover:font-semibold hover:bg-neutral-200 hover:dark:bg-neutral-700 flex gap-2 items-center cursor-pointer"
                        onClick={() => props.setPageContext({page: 'list'})}
                    >
                        <CheckIcon className="size-6" />
                        <div>Save</div>
                    </button>
                </div>
            </div>
            <div className="border-b mb-4">
                <div className="flex justify-between gap-4">
                    <div className="text-lg mb-4 block md:flex w-1/2">
                        <label htmlFor="survey-publish-date" className="mr-1 min-w-[120px]">Publish Date:</label>
                        <input id="survey-publish-date" name="publishDate" value={nowStr} className="border-1 border-neutral-500 rounded px-4 py-1 w-full" />
                    </div>
                    <div className="text-lg mb-4 block md:flex w-1/2">
                        <label htmlFor="survey-close-date" className="md:text-right mr-1 min-w-[120px]">Close Date:</label>
                        <input id="survey-close-date" name="closeDate" value={nowStr} className="border-1 border-neutral-500 rounded px-4 py-1 w-full" />
                    </div>
                </div>
                <div className="text-lg mb-4 block md:flex">
                    <label htmlFor="survey-title" className="mr-1 min-w-[120px]">Survey Title:</label>
                    <input id="survey-title" name="title" placeholder="Catchy Title" className="border-1 border-neutral-500 rounded px-4 py-1 w-full" />
                </div>
                <div className="text-lg mb-4 block md:flex">
                    <label htmlFor="survey-intro" className="mr-1 min-w-[120px]">Survey Intro:</label>
                    <div className="w-full">
                        <textarea maxLength={1024} rows={3} id="survey-intro" name="intro" placeholder="Captivate your audiance with a survey prompt." className="resize-none border-1 border-neutral-500 rounded px-4 py-1 w-full text-sm" value={formIntro} onChange={introOnChange}></textarea>
                        <div className={`text-sm text-right ${(1024 - formIntro.length) < 50 ? 'text-rose-700 dark:text-rose-400' : 'text-neutral-700 dark:text-neutral-400'} mt-[-0.5rem]`}>{1024 - formIntro.length}</div>
                    </div>
                </div>
            </div>
            <div>
                Question Configurator
            </div>
        </div>
    );
}

type ListPageContext = {
    page: 'list';
}

type SurveyIdPageContext = {
    page: 'edit' | 'view';
    surveyId: number;
}

type DashboardPageContext = ListPageContext | SurveyIdPageContext;

export const SurveyDashboard = () => {
    const [pageContext, setPageContext] = useState<DashboardPageContext>({page: 'list'});

    return (
        <div className="w-full min-h-screen text-neutral-900 bg-neutral-50 dark:text-neutral-200 dark:bg-neutral-900">
            <div className="container max-w-screen-lg min-h-screen mx-auto flex flex-col justify-between">
                <div className="px-4">
                    {(() => {
                        switch (pageContext.page) {
                            case 'edit':
                                return <SurveyEditor pageContext={pageContext} setPageContext={setPageContext} />
                            case 'view':
                                return
                            case 'list':
                            default:
                                return <DashboardList setPageContext={setPageContext} />;
                        }
                    })()}
                </div>
                <footer className="p-2 text-xs flex justify-between items-center rounded-t-lg bg-neutral-200 dark:bg-neutral-700">
                    <div className="max-w-1/2">Visit <span className="underline cursor-pointer" onClick={() => navigateTo("https://www.reddit.com/r/CommunitySurvey")}>r/CommunitySurvey</span> for Feedback and Support</div>
                    <div className="max-w-1/2">Community-Survey BETA</div>
                </footer>
            </div>
        </div>
    );
};
