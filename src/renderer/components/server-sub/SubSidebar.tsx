import { MDBCol } from 'mdb-react-ui-kit';
import React from 'react';
import SubSidebarHeader from '../utlis/SubSIdebarHeader';
import LevelBoostUI from '../utlis/LevelBoostUI';
import ChannelList from '../utlis/ChannelList';
import MiniProfilePanel from '../utlis/MIniProfilePanel';
import ChannelListItem from '../utlis/ChannelListItem';
import Icons from '../../shared/icons';
import { useParams } from 'react-router-dom';

const SubSidebar = React.memo((props: any) => {
  const routeParams = useParams();

  return (
    <MDBCol md={3} className="sub-sidebar p-0 h-100">
      {routeParams.serverId == '0' ? (
        <div className="search-box header-search-box d-flex justify-content-center">
          <input type="text" placeholder="Find or start a conversation" />
        </div>
      ) : (
        <SubSidebarHeader />
      )}
      <div className="sub-sidebar-inner px-2">
        <LevelBoostUI />

        {routeParams.serverId == '0' && (
          <div className="mb-4">
            <div className="mb-2">
              <ChannelListItem
                icon={
                  <Icons.Friends
                    className="hash-sign"
                    style={{ marginRight: 15 }}
                  />
                }
                tools={false}
                title="Friends"
                url="channel/welcome-and-rules"
              />
            </div>

            <div className="mb-2">
              <ChannelListItem
                icon={
                  <Icons.Nitro
                    className="hash-sign"
                    style={{ marginRight: 15 }}
                  />
                }
                tools={false}
                title="Nitro"
                url="channel/welcome-and-rules"
              />
            </div>

            <div className="mb-2">
              <ChannelListItem
                icon={
                  <Icons.Shop
                    className="hash-sign"
                    style={{ marginRight: 15 }}
                  />
                }
                tools={false}
                title="Shop"
                url="channel/welcome-and-rules"
              />
            </div>
          </div>
        )}

        {routeParams.serverId == '0' ? (
          <ChannelList
            title="Direct Messages"
            channels={[
              {
                title: 'Atharva',
                url: 'channel/test-dm',
                icon: <Icons.DiscordLogo className="hash-sign" />,
              },
            ]}
          />
        ) : (
          <>
            <ChannelList
              title="Information"
              channels={[
                {
                  title: 'welcome-and-rules',
                  url: 'channel/welcome-and-rules',
                },
                {
                  title: 'notes-resources',
                  url: 'channel/notes-resources',
                },
              ]}
            />
            <ChannelList
              title="Text channels"
              channels={[
                {
                  title: 'general',
                  url: 'channel/general',
                },
                {
                  title: 'homework-help',
                  url: 'channel/homework-help',
                },
              ]}
            />
          </>
        )}
      </div>
      <MiniProfilePanel />
    </MDBCol>
  );
});

export default SubSidebar;
