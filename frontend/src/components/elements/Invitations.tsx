import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {Invitation} from "../../redux/rootslices/api/invitations.slice";


interface InvitationsState {
    invitations: Invitation[];
}

// Actions
export enum InvitationsActionType {
    SET_INVITATIONS = 'SET_INVITATIONS',
    ADD_INVITATION = 'ADD_INVITATION',
    REMOVE_INVITATION_BY_EMAIL = 'REMOVE_INVITATION_BY_EMAIL',
    REMOVE_INVITATION_BY_ID = 'REMOVE_INVITATION_BY_ID',
}

type SetInvitationsAction = {
    type: InvitationsActionType.SET_INVITATIONS;
    payload: Invitation[];
};

type AddInvitationAction = {
    type: InvitationsActionType.ADD_INVITATION;
    payload: Invitation;
};

type RemoveInvitationAction = {
    type: InvitationsActionType.REMOVE_INVITATION_BY_EMAIL;
    payload: string; // email address
};

type RemoveInvitationByIdAction = {
    type: InvitationsActionType.REMOVE_INVITATION_BY_ID;
    payload: string; // group id
};

type InvitationsAction = SetInvitationsAction | AddInvitationAction | RemoveInvitationAction | RemoveInvitationByIdAction;

const invitationsReducer = (state: InvitationsState, action: InvitationsAction): InvitationsState => {
    switch (action.type) {
        case InvitationsActionType.SET_INVITATIONS:
            return { ...state, invitations: action.payload };
        case InvitationsActionType.ADD_INVITATION:
            const isDuplicate = state.invitations.some(
                (invitation) =>
                    invitation.id.emailAddress === action.payload.id.emailAddress &&
                    invitation.id.group.id === action.payload.id.group.id
            );

            if (!isDuplicate) {
                return { ...state, invitations: [...state.invitations, action.payload] };
            }

            return state;
        case InvitationsActionType.REMOVE_INVITATION_BY_EMAIL:
            return { ...state, invitations: state.invitations.filter(invitation => invitation.id.emailAddress !== action.payload) };
        case InvitationsActionType.REMOVE_INVITATION_BY_ID:
            return { ...state, invitations: state.invitations.filter(invitation => invitation.id.group.id !== action.payload) };
        default:
            return state;
    }
};

type InvitationsContextType = {
    state: InvitationsState;
    dispatch: React.Dispatch<InvitationsAction>;
};

const InvitationsContext = createContext<InvitationsContextType | undefined>(undefined);

type InvitationsProviderProps = {
    children: ReactNode;
};

export const InvitationsProvider: React.FC<InvitationsProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(invitationsReducer, { invitations: [] });

    return (
        <InvitationsContext.Provider value={{ state, dispatch }}>
            {children}
        </InvitationsContext.Provider>
    );
};

export const useInvitations = () => {
    const context = useContext(InvitationsContext);
    if (!context) {
        throw new Error('useInvitations must be used within an InvitationsProvider');
    }
    return context;
};
