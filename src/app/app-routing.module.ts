import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartComponent } from './start/start.component';

const routes: Routes = [
{ path: '', component: StartComponent, },
{ path: 'start', component: StartComponent, },
{
  path: 'home',
  loadChildren: () => import('./home/home.module')
    .then(mod => mod.HomeModule)
},
{
  path: 'teapass',
  loadChildren: () => import('./teapass/teapass.module')
    .then(mod => mod.TeapassModule)
},
{
  path: 'cafe/room/:room',
  loadChildren: () => import('./cafeRoom/cafeRoom.module')
    .then(mod => mod.CafeRoomModule)
},
{
  path: 'create',
  loadChildren: () => import('./create/create.module')
    .then(mod => mod.CreateModule)
},
{
  path: 'profile/:user',
  loadChildren: () => import('./profile/profile.module')
    .then(mod => mod.ProfileModule)
},
{
  path: 'market/:type',
  loadChildren: () => import('./market/market.module')
    .then(mod => mod.MarketModule)
},
{
  path: 'showcase/:nftea/:owner',
  loadChildren: () => import('./showcase/showcase.module')
    .then(mod => mod.ShowcaseModule)
},
{
  path: 'wallet',
  loadChildren: () => import('./wallet/wallet.module')
    .then(mod => mod.WalletModule)
},
{
  path: 'raffle',
  loadChildren: () => import('./raffle/raffle.module')
    .then(mod => mod.RaffleModule)
},
{
  path: 'raffle/:game',
  loadChildren: () => import('./rafflePlay/rafflePlay.module')
    .then(mod => mod.RafflePlayModule)
},
{
  path: 'support',
  loadChildren: () => import('./support/support.module')
    .then(mod => mod.SupportModule)
},
{
  path: 'mint/:user',
  loadChildren: () => import('./mint/mint.module')
    .then(mod => mod.MintModule)
},
{
  path: 'about/:type',
  loadChildren: () => import('./about/about.module')
    .then(mod => mod.AboutModule)
},
{
  path: 'marketing',
  loadChildren: () => import('./marketing/marketing.module')
    .then(mod => mod.MarketingModule)
},
{
  path: 'album/:id',
  loadChildren: () => import('./albums/album.module')
    .then(mod => mod.AlbumModule)
},
{
  path: 'refer/:user',
  loadChildren: () => import('./refer/refer.module')
    .then(mod => mod.ReferModule)
},
{
  path: '**',
  loadChildren: () => import('./four04/four04.module')
    .then(mod => mod.Four04Module)
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
