import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GroupData, GroupListData, GroupMember} from "../api/groups.slice";

const initialState = {
    groups: [] as GroupListData,
}

const groupsSlice = createSlice({
    name: 'group-data',
    initialState,
    reducers: {
        setGroupData: (state, action: PayloadAction<GroupListData>) => {
            state.groups = action.payload;
        },
        addNewGroup: (state, action: PayloadAction<GroupData>) => {
            state.groups.push(action.payload);
        },
        updateSingleGroupData: (
            state,
            action: PayloadAction<{ updatedData: Partial<GroupData> }>
        ) => {
            const {updatedData} = action.payload;
            const groupId = updatedData.id
            const groupToUpdate = state.groups.find((group) => group.id === groupId);
            if (groupToUpdate) {
                Object.assign(groupToUpdate, updatedData);
            }
        },
        updateGroupName: (state, action: PayloadAction<{ groupId: string; groupName: string }>) => {
            const groupToUpdate = state.groups.find((group) => group.id === action.payload.groupId);
            if (groupToUpdate) {
                groupToUpdate.groupName = action.payload.groupName;
            }
        },
        updateGroupDescription: (state, action: PayloadAction<{ groupId: string; groupDescription: string }>) => {
            const groupToUpdate = state.groups.find((group) => group.id === action.payload.groupId);
            if (groupToUpdate) {
                groupToUpdate.groupDescription = action.payload.groupDescription;
            }
        },
        addGroupMember: (state, action: PayloadAction<{ groupId: string; member: GroupMember }>) => {
            const groupToUpdate = state.groups.find((group) => group.id === action.payload.groupId);
            if (groupToUpdate) {
                groupToUpdate.groupMembers.push(action.payload.member);
            }
        },
        removeGroupMember: (state, action: PayloadAction<{ groupId: string; userId: string }>) => {
            const groupToUpdate = state.groups.find((group) => group.id === action.payload.groupId);
            if (groupToUpdate) {
                groupToUpdate.groupMembers = groupToUpdate.groupMembers.filter(
                    (member) => member.user.emailAddress !== action.payload.userId
                );
            }
        },
        setEditAccess: (state, action: PayloadAction<{ groupId: string; userId: string; hasEditAccess: boolean }>) => {
            const groupToUpdate = state.groups.find((group) => group.id === action.payload.groupId);
            if (groupToUpdate) {
                const memberToUpdate = groupToUpdate.groupMembers.find(
                    (member) => member.user.emailAddress === action.payload.userId
                );
                if (memberToUpdate) {
                    memberToUpdate.hasEditAccess = action.payload.hasEditAccess;
                }
            }
        },
        clearGroupsData: (_) => {
            return initialState;
        },
    },
});

export const {
    setGroupData,
    addNewGroup,
    updateSingleGroupData,
    updateGroupName,
    updateGroupDescription,
    addGroupMember,
    removeGroupMember,
    setEditAccess,
    clearGroupsData
} = groupsSlice.actions;

export const selectGroupData = (state: { groupData: { groups: GroupListData } }) => state.groupData.groups;
export const selectGroupByIdMemoized = createSelector(
    [selectGroupData, (_, groupId) => groupId],
    (groups, groupId) => groups.find((group) => group.id === groupId)
);

export default groupsSlice.reducer;
