import React from 'react';

const Notification = ({ notification }: { notification: any }) => {
    if (!notification) return null;

    return (
        <div
            className={`
                fixed top-6 right-6 z-[99999]
                min-w-[320px]
                rounded-xl
                px-5 py-3.5
                shadow-xl
                text-white
                font-sans text-sm font-semibold
                ${notification.type === "success"
                    ? "bg-emerald-600 shadow-emerald-500/10"
                    : notification.type === "error"
                        ? "bg-rose-600 shadow-rose-500/10"
                        : "bg-[#6D5DF6] shadow-[#6D5DF6]/10"
                }
            `}
        >
            {notification.message}
        </div>
    );
};

export default Notification;
