# servicio cross domain para agregar apuesta
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from service.models import Bettor, Bet
from datetime import datetime
from decimal import Decimal

# funcion para agregar
# los parametros vienen por get ya que se va a ejecutar desde un jsonp desde el portal de freebitcoin
# cada oferta esta asociada a un usuario, el usuario debe estar registrado previamente, de lo contrario falla

#def add(request, callback, executed_at, game, bet, roll, stake, multiplicator, profit, jackpot, nounce, balance_before, balance_after, username  ):
def add(request):

    
    executed_at = datetime.strptime(request.GET.get('executed_at'),"%Y-%m-%d %H:%M:%S")

    u = Bettor.objects.get(username=request.GET.get('username'))

    new_bet = Bet(executed_at=executed_at, game=request.GET.get('game').upper(), bet=request.GET.get('bet').upper(), roll=int(request.GET.get('roll')), stake=Decimal(request.GET.get('stake')), multiplicator=Decimal(request.GET.get('multiplicator')), profit=Decimal(request.GET.get('profit')), jackpot=bool(request.GET.get('jackpot')), nounce=int(request.GET.get('nounce')), balance_before=Decimal(request.GET.get('balance_before')), balance_after=Decimal(request.GET.get('balance_after')), bettor=u, server_seed=request.GET.get('server_seed'), client_seed=request.GET.get('client_seed'), server_hash=request.GET.get('server_hash') )
    new_bet.save()

    response = '{"success":"%s"}' % (new_bet.id)

    if 'callback' in request.GET:
        #response = '{"success":"%s", "jsonp":"1"}' % (request.GET.get('executed_at'))
        response = '%s(%s);' % (request.GET.get('callback'), response)
        return HttpResponse(response, "text/javascript")

    return HttpResponse(response, "application/json")

