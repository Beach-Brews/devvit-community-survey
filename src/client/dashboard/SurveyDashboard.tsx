import {
    PlusCircleIcon,
    StopCircleIcon,
    PresentationChartBarIcon,
    TrashIcon,
    PencilSquareIcon,
    CheckIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/solid';
import { Dispatch, JSX, SetStateAction, useState } from 'react';

interface SurveyLineItemProps {
    name: string,
    status: 'draft' | 'scheduled' | 'live' | 'closed',
    count: number,
    publishDate: string,
    closeDate: string
}

const SurveyLineItem = (props: SurveyLineItemProps) => {

    const actions: JSX.Element[] = [];

    switch (props.status) {
        case 'draft':
        case 'scheduled':
            actions.push(<div className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200"><PencilSquareIcon key={`${props.name}-edit`} className="size-6" /></div>);
            actions.push(<div className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200"><TrashIcon key={`${props.name}-delete`} className="size-6" /></div>);
            break;
        case 'live':
            actions.push(<div className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200"><PresentationChartBarIcon key={`${props.name}-edit`} className="size-6" /></div>);
            actions.push(<div className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200"><StopCircleIcon key={`${props.name}-delete`} className="size-6" /></div>);
            break;
        case 'closed':
            actions.push(<div className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200"><PresentationChartBarIcon key={`${props.name}-edit`} className="size-6" /></div>);
            actions.push(<div className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200"><TrashIcon key={`${props.name}-delete`} className="size-6" /></div>);
            break;
    }

    return (
        <tr key={props.name} className="odd:bg-gray-50 odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {props.name}
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
    setPage: Dispatch<SetStateAction<DashboardPages>>;
}

const DashboardList = (props: DashboardListProps) => {
    return (
        <div>
            <div className="flex justify-between items-center border-b mb-4">
                <h1 className="text-2xl font-bold">Community Survey Dashboard</h1>
                <div className="m-4">
                    <button
                        className="bg-lime-800 text-white px-2 py-1 rounded-lg text-small hover:font-semibold hover:bg-lime-700 flex gap-2 items-center cursor-pointer"
                        onClick={() => props.setPage('editor')}
                    >
                        <PlusCircleIcon className="size-6" />
                        <div>New</div>
                    </button>
                </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs uppercase text-gray-800 bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
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
                    <SurveyLineItem name="Complete Survey" status="closed" count={75} publishDate="Mon 9/1/2025 9:00 AM" closeDate="Mon 9/8/2025 9:00 AM" />
                    <SurveyLineItem name="Always Open" status="live" count={1557} publishDate="Mon 9/8/2025 9:00 AM" closeDate="-" />
                    <SurveyLineItem name="Live Survey" status="live" count={23} publishDate="Mon 9/8/2025 9:00 AM" closeDate="Mon 9/15/2025 9:00 AM" />
                    <SurveyLineItem name="Scheduled Survey" status="scheduled" count={0} publishDate="Mon 9/15/2025 9:00 AM" closeDate="Mon 9/22/2025 9:00 AM" />
                    <SurveyLineItem name="Draft Survey" status="draft" count={0} publishDate="-" closeDate="-" />
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
                    <li>100 Char max question</li>
                    <li>1024 character max description</li>
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
    setPage: Dispatch<SetStateAction<DashboardPages>>;
}

export const SurveyEditor = (props: SurveyEditorProps) => {
    return (
        <div>
            <div className="flex justify-between items-center border-b mb-4">
                <h1 className="text-2xl font-bold">Survey Editor</h1>
                <div className="m-4 flex justify-between items-center gap-4">
                    <button
                        className="bg-blue-800 text-white px-2 py-1 rounded-lg text-small font-semibold flex gap-2 items-center cursor-pointer"
                        onClick={() => props.setPage('list')}
                    >
                        <CalendarDaysIcon className="size-6" />
                        <div>Schedule</div>
                    </button>
                    <button
                        className="border-2 border-slate-600 bg-gray-100 text-gray-950 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-50 px-2 py-1 rounded-lg text-small font-semibold flex gap-2 items-center cursor-pointer"
                        onClick={() => props.setPage('list')}
                    >
                        <CheckIcon className="size-6" />
                        <div>Save</div>
                    </button>
                </div>
            </div>
            <div>
                The configurator section here
            </div>
        </div>
    );
}

type DashboardPages = 'editor' | 'list';

export const SurveyDashboard = () => {
    const [page, setPage] = useState<DashboardPages>('list');

    return (
        <div className="w-full min-h-screen text-gray-700 bg-gray-50 dark:text-gray-200 dark:bg-gray-900">
            <div className="container max-w-screen-lg min-h-screen mx-auto p-4 text-gray-700 bg-gray-50 dark:text-gray-200 dark:bg-gray-900">
                {(page == 'editor' ? <SurveyEditor setPage={setPage} /> : <DashboardList setPage={setPage} />)}
            </div>
        </div>
    );
};
