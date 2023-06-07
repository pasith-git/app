const MESSAGE = {
    date: {
        title: "Datetime validation",
        error: {
            isSameOrAfter: "The supplied date could be the same or after today"
        },
    },
    datetime: {
        title: "Invalid Datetime",
        error: "Datetime is invalid",
        expired: "The time for booking has expired",
    },
    time: {
        title: "Invalid time",
        error: "Time is invalid",
        sc_error: "The start_time must be less than the end_time",
    },
    created: "Created successfully",
    updated: "Updated successfully",
    deleted: "Deleted successfully",
    deleteFailed: "Deletion was unsuccessful",
    PermissionAccessingFailed: "You don't have permission to access data that is not your own",

}

export default MESSAGE;