from django.urls import path

from . import views, bet

urlpatterns = [
    #path('addBet?callback=<callback>&csrf_token=<csrf_token>&executed_at=<executed_at>&game=<game>&bet=<bet>&roll=<roll>&stale=<stake>&multiplicator=<multiplicator>&profit=<profit>&jackpot=<jackpot>&nounce=<nounce>&balance_before=<balance_before>&balance_after=<balance_after>&username=<username>', bet.add, name='addbet'),
    path('addBet', bet.add, name='addbet'),
    path('', views.index, name='index'),
]