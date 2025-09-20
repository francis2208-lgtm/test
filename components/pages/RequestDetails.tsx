import React from 'react';
import { ActivityRequest, RequestStatus, RequestType } from '../../types';
import { ICONS, STATUS_COLORS } from '../../constants';

interface RequestDetailsProps {
  request: ActivityRequest;
  onBack: () => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-1 text-md font-semibold text-gray-800 dark:text-dark-text">{value}</p>
  </div>
);

const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onBack }) => {
  const renderRequestSpecificDetails = () => {
    switch (request.type) {
      case RequestType.Leave:
        return (
          <>
            <DetailItem label="Leave Type" value={request.leaveType} />
            <DetailItem label="Start Date" value={request.startDate} />
            <DetailItem label="End Date" value={request.endDate} />
          </>
        );
      case RequestType.Overtime:
        return (
          <>
            <DetailItem label="Overtime Type" value={request.otType} />
            <DetailItem label="Date of OT" value={request.otDate} />
            <DetailItem label="Hours Rendered" value={`${request.hours} hours`} />
            <DetailItem label="With Lunch Break" value={request.withLunch ? 'Yes' : 'No'} />
          </>
        );
      case RequestType.ScheduleChange:
        return (
          <>
            <DetailItem label="Date of Change" value={request.scheduleChangeDate} />
            <DetailItem label="Current Schedule" value={request.currentSchedule} />
            <DetailItem label="Requested Schedule" value={request.requestedSchedule} />
          </>
        );
      case RequestType.TimeAdjustment:
        return (
          <>
            <DetailItem label="Date for Adjustment" value={request.adjustmentDate} />
            <DetailItem label="Correct Time In" value={request.correctTimeIn} />
            <DetailItem label="Correct Time Out" value={request.correctTimeOut} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h2 className="text-2xl font-bold mb-1 text-gray-800 dark:text-dark-text">{request.type} Details</h2>
             <span className={`px-3 py-1 text-sm font-semibold rounded-full ${STATUS_COLORS[request.status]}`}>
                {request.status}
            </span>
        </div>
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-black dark:bg-rss-green dark:hover:bg-green-600 rounded-lg shadow-md transition-all"
        >
          {ICONS.back}
          <span>Back to List</span>
        </button>
      </div>

      <div className="border-t border-light-border dark:border-dark-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem label="Request ID" value={<span className="font-mono text-sm">{request.id}</span>} />
        <DetailItem label="Date Filed" value={request.date} />
        {renderRequestSpecificDetails()}
      </div>

       {request.reason && (
        <div className="mt-6 border-t border-light-border dark:border-dark-border pt-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</p>
            <p className="mt-2 p-4 bg-slate-50 dark:bg-dark-bg rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {request.reason}
            </p>
        </div>
      )}

      {request.documentUrl && (
         <div className="mt-6 border-t border-light-border dark:border-dark-border pt-6">
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Attachment</p>
             <a href={request.documentUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                View Attached Document
             </a>
         </div>
      )}
    </div>
  );
};

export default RequestDetails;